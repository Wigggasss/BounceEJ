(function() {
    // 1. Setup Global Connection
    const SB_URL = "https://imhorwdmvhguvsayleqr.supabase.co";
    const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltaG9yd2RtdmhndXZzYXlsZXFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTQ4MjMsImV4cCI6MjA5MzIzMDgyM30.r0rKsHkIAQ8GrUPCY0rYS1z-8rT7fTGDRJfWU6RSNWM";
    
    // Fix: Only create the client if it doesn't exist
    if (!window.gameSupabase) {
        window.gameSupabase = window.supabase.createClient(SB_URL, SB_KEY);
    }

    const myId = sessionStorage.getItem('ej_player_id') || 'EJ-' + Math.random().toString(36).substr(2, 5);
    sessionStorage.setItem('ej_player_id', myId);

    // 2. Global Player Counter (Presence)
    const lobby = window.gameSupabase.channel('global-lobby', {
        config: { presence: { key: myId } }
    });

    lobby.on('presence', { event: 'sync' }, () => {
        const state = lobby.presenceState();
        const count = Object.keys(state).length;
        const counterEl = document.getElementById('onlinePlayerCount');
        if (counterEl) counterEl.innerText = count;
    }).subscribe(async (status) => {
        if (status === 'SUBSCRIBED') await lobby.track({ id: myId });
    });

    // 3. ADMIN LISTENER (Combined here to fix "Multiple Instances" error)
    const admin = window.gameSupabase.channel('admin_control');
    
    admin.on('broadcast', { event: 'remote_lock' }, ({ payload }) => {
        const btn = document.getElementById(payload.id);
        if (btn) {
            btn.disabled = payload.locked;
            const label = btn.querySelector('span:not(.menu-emoji)');
            if (label && payload.text) label.innerText = payload.text;
            btn.style.opacity = payload.locked ? "0.5" : "1";
        }
    })
    .on('broadcast', { event: 'remote_debug' }, ({ payload }) => {
        if (payload.code === '888') alert("ADMIN: Maintenance mode active.");
        if (payload.code === '999') window.location.reload();
    })
    .subscribe();

})();
