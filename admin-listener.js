(function() {
    const supabase = window.supabase.createClient(
        window.BOUNCE_EJ_SUPABASE.url, 
        window.BOUNCE_EJ_SUPABASE.publishableKey
    );

    const listener = supabase.channel('admin_control_center');

    listener.on('broadcast', { event: 'lock_button' }, ({ payload }) => {
        const targetBtn = document.getElementById(payload.id);
        if (targetBtn) {
            targetBtn.disabled = payload.locked;
            // This updates the text (e.g., "Multiplayer" becomes "Updating...")
            const label = targetBtn.querySelector('span:not(.menu-emoji)');
            if (label) label.innerText = payload.text;
        }
    })
    .on('broadcast', { event: 'trigger_debug' }, ({ payload }) => {
        const errorCodes = {
            101: "DATABASE_STALE: Reloading schema...",
            404: "TABLE_MISSING: Check Supabase Dashboard.",
            500: "SYNC_FAIL: Restarting Realtime engine."
        };
        console.warn(`[ADMIN DEBUG] Code ${payload.code}: ${errorCodes[payload.code]}`);
        alert(`Admin Debug Message: ${errorCodes[payload.code]}`);
    })
    .subscribe();
})();
