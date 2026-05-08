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
        console.warn("Supabase SDK is unavailable; admin panel commands are offline.");
        return;
    }

    const adminChannel = client.channel('admin_control');
    adminChannel.subscribe();

    window.sendButtonCommand = function(buttonId, isLocked, newText) {
        adminChannel.send({
            type: 'broadcast',
            event: 'remote_lock',
            payload: { id: buttonId, locked: isLocked, text: newText }
        });
    };
})();
