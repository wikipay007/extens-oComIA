// content.js

let lastCtrlPress = 0;
let activeMenu = null;
let currentTarget = null;

document.addEventListener('keydown', (e) => {
    if (e.key === 'Control') {
        const now = Date.now();
        if (now - lastCtrlPress < 300) {
            showMenu();
        }
        lastCtrlPress = now;
    }
});

function getSentenceAtCaret(element) {
    let text = "";
    let cursorPosition = 0;

    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        text = element.value;
        cursorPosition = element.selectionStart;
    } else if (element.isContentEditable) {
        text = element.innerText;
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(element);
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            cursorPosition = preCaretRange.toString().length;
        }
    }

    if (!text) return null;

    // Simple sentence detection
    const sentences = text.match(/[^.!?]+[.!?]*/g) || [text];
    let currentPos = 0;
    for (let sentence of sentences) {
        if (cursorPosition >= currentPos && cursorPosition <= currentPos + sentence.length) {
            return {
                text: sentence.trim(),
                start: currentPos,
                end: currentPos + sentence.length
            };
        }
        currentPos += sentence.length;
    }
    return null;
}

function showMenu() {
    const activeEl = document.activeElement;
    if (!activeEl || (!activeEl.isContentEditable && activeEl.tagName !== 'INPUT' && activeEl.tagName !== 'TEXTAREA')) {
        return;
    }

    const sentenceData = getSentenceAtCaret(activeEl);
    if (!sentenceData) return;

    currentTarget = { element: activeEl, data: sentenceData };

    if (activeMenu) activeMenu.remove();

    const menu = document.createElement('div');
    menu.className = 'smart-write-menu';
    
    const rect = activeEl.getBoundingClientRect();
    // In a real implementation, we'd use a library to position near caret
    // For now, position near the element
    menu.style.top = `${window.scrollY + rect.top - 80}px`;
    menu.style.left = `${window.scrollX + rect.left}px`;

    menu.innerHTML = `
        <div class="smart-write-option primary" id="sw-correct">✨ Corrigir Ortografia/Gramática</div>
        <div class="smart-write-option" id="sw-rewrite">🔄 Reescrever (Manter Tom)</div>
    `;

    document.body.appendChild(menu);
    activeMenu = menu;

    document.getElementById('sw-correct').onclick = () => handleAction('correct');
    document.getElementById('sw-rewrite').onclick = () => handleAction('rewrite');

    // Close menu on click outside
    const closeMenu = (e) => {
        if (!menu.contains(e.target)) {
            menu.remove();
            activeMenu = null;
            document.removeEventListener('mousedown', closeMenu);
        }
    };
    setTimeout(() => document.addEventListener('mousedown', closeMenu), 10);
}

async function handleAction(type) {
    if (!currentTarget) return;
    
    const originalText = currentTarget.data.text;
    activeMenu.innerHTML = `<div class="smart-write-loading">Processando com Gemini...</div>`;

    chrome.runtime.sendMessage({
        action: "processText",
        text: originalText,
        type: type
    }, (response) => {
        if (response && response.success) {
            applyResult(response.data, type);
        } else {
            alert("Erro: " + (response?.error || "Desconhecido"));
        }
        if (activeMenu) {
            activeMenu.remove();
            activeMenu = null;
        }
    });
}

function applyResult(data, type) {
    const el = currentTarget.element;
    const { start, end } = currentTarget.data;
    let newText = "";

    if (type === 'correct') {
        newText = data.correctedText;
        // Highlight errors logic would go here if we were in a contenteditable
    } else {
        newText = data;
    }

    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        const val = el.value;
        el.value = val.substring(0, start) + newText + val.substring(end);
    } else if (el.isContentEditable) {
        const val = el.innerText;
        el.innerText = val.substring(0, start) + newText + val.substring(end);
    }
}
