(async function() {
    async function getSupabaseClient() {
        if (typeof window.whenBounceEJSupabaseClient === "function") {
            return window.whenBounceEJSupabaseClient();
        }

        if (window.supabaseClient) {
            return window.supabaseClient;
        }

        return null;
    }

    const client = await getSupabaseClient();
    if (!client) {
        console.warn("Supabase SDK is unavailable; multiplayer presence is offline.");
        return;
    }

    window.gameSupabase = window.gameSupabase || client;

    const myId = sessionStorage.getItem('ej_player_id') || 'EJ-' + Math.random().toString(36).substr(2, 5);
    sessionStorage.setItem('ej_player_id', myId);

    const lobby = client.channel('global-lobby', {
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
})();
