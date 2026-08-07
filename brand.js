// JANUS — resalta cada mención de "JANUS" en dorado (marca del producto).
// Se ejecuta al cargar y también sobre nodos añadidos dinámicamente (modal de auth, chat).
(function () {
    if (!window.NodeFilter || !document.createTreeWalker) return;

    function wrapTextNode(node) {
        var text = node.nodeValue;
        if (!text || text.indexOf('JANUS') === -1) return;
        var parent = node.parentElement;
        if (!parent) return;
        var tag = parent.tagName;
        if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'TEXTAREA' || tag === 'INPUT' || tag === 'OPTION') return;
        if (parent.closest('.brand-janus') || parent.closest('.btn') || parent.closest('.price-badge')) return;

        var parts = text.split('JANUS');
        if (parts.length < 2) return;
        var frag = document.createDocumentFragment();
        for (var i = 0; i < parts.length; i++) {
            if (i > 0) {
                var s = document.createElement('span');
                s.className = 'brand-janus';
                s.textContent = 'JANUS';
                frag.appendChild(s);
            }
            if (parts[i]) frag.appendChild(document.createTextNode(parts[i]));
        }
        node.parentNode.replaceChild(frag, node);
    }

    function highlight(root) {
        if (!root || root.nodeType !== 1) return;
        var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
            acceptNode: function (n) {
                var t = n.nodeValue;
                if (!t || t.indexOf('JANUS') === -1) return NodeFilter.FILTER_REJECT;
                var p = n.parentElement;
                if (!p) return NodeFilter.FILTER_REJECT;
                if (p.tagName === 'SCRIPT' || p.tagName === 'STYLE' || p.tagName === 'TEXTAREA' || p.tagName === 'INPUT' || p.tagName === 'OPTION') return NodeFilter.FILTER_REJECT;
                if (p.closest('.brand-janus') || p.closest('.btn') || p.closest('.price-badge')) return NodeFilter.FILTER_REJECT;
                return NodeFilter.FILTER_ACCEPT;
            }
        });
        var targets = [];
        while (walker.nextNode()) targets.push(walker.currentNode);
        targets.forEach(wrapTextNode);
    }

    function init() {
        highlight(document.body);
        if (window.MutationObserver) {
            var mo = new MutationObserver(function (muts) {
                for (var i = 0; i < muts.length; i++) {
                    var added = muts[i].addedNodes;
                    for (var j = 0; j < added.length; j++) {
                        var n = added[j];
                        if (n.nodeType === 1) highlight(n);
                        else if (n.nodeType === 3) wrapTextNode(n);
                    }
                }
            });
            mo.observe(document.body, { childList: true, subtree: true });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
