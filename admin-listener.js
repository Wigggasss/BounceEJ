(function() {

    // This must match the channel in your admin.html
    const admin = supabase.channel('admin_control');

    // 1. LISTEN FOR REMOTE LOCKS
    admin.on('broadcast', { event: 'remote_lock' }, ({ payload }) => {
        const btn = document.getElementById(payload.id);
        if (btn) {
            btn.disabled = payload.locked;
            
            // Find the text span inside the button and update it
            const label = btn.querySelector('span:not(.menu-emoji):not(.lock-icon)');
            if (label && payload.text) {
                label.innerText = payload.text;
            }
            
            // Apply the "locked" visual style
            btn.style.opacity = payload.locked ? "0.5" : "1";
            btn.style.filter = payload.locked ? "grayscale(100%)" : "none";
            btn.style.pointerEvents = payload.locked ? "none" : "auto";
        }
    })
    // 2. LISTEN FOR DEBUG CODES
    .on('broadcast', { event: 'remote_debug' }, ({ payload }) => {
        const errorCodes = {
            101: "DATABASE_STALE: Reloading schema...",
            404: "TABLE_MISSING: Check Supabase Dashboard.",
            888: "MAINTENANCE: Game features are being updated.",
            999: "FORCE_RELOAD: Refreshing page for updates..."
        };

        const msg = errorCodes[payload.code] || "UNKNOWN_DEBUG_CODE";
        console.warn(`[ADMIN] Code ${payload.code}: ${msg}`);
        
        if (payload.code === '999') {
            window.location.reload();
        } else {
            alert(`Admin Message (${payload.code}):\n${msg}`);
        }
    })
    .subscribe();

    // 3. KEYBOARD SHORTCUT (Shift + A)
    // This allows YOU to see the Admin UI if you add it to the game page
    document.addEventListener('keydown', (e) => {
        if (e.shiftKey && e.key === 'A') {
            const panel = document.getElementById('adminPanelUI');
            if (panel) {
                panel.classList.toggle('hidden');
                console.log("Admin Mode Toggled");
            }
        }
    });

})();
