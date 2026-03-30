// ============================================================
//  auth.js — MyConservationist Supabase Auth Helper
//  Include this script on EVERY page with:
//  <script src="auth.js"></script>
//
//  SETUP: Replace the two values below with your own from
//  https://supabase.com → your project → Settings → API
// ============================================================

const SUPABASE_URL  = "https://YOUR_PROJECT_ID.supabase.co";   // ← replace
const SUPABASE_ANON = "YOUR_ANON_PUBLIC_KEY";                  // ← replace

// Load Supabase SDK from CDN
const _supaScript = document.createElement("script");
_supaScript.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js";
_supaScript.onload = () => {
    window._supa = supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
    document.dispatchEvent(new Event("supabase:ready"));
};
document.head.appendChild(_supaScript);

// ── Helpers ──────────────────────────────────────────────────

/** Get current logged-in user (null if not logged in) */
async function getUser() {
    const { data } = await window._supa.auth.getUser();
    return data?.user ?? null;
}

/** Sign up with email + password. Supabase sends a confirmation email automatically. */
async function signUp(email, password, displayName) {
    const { data, error } = await window._supa.auth.signUp({
        email,
        password,
        options: {
            data: { display_name: displayName },       // stored in user metadata
            emailRedirectTo: window.location.origin + "/index.html"
        }
    });
    return { data, error };
}

/** Sign in with email + password */
async function signIn(email, password) {
    const { data, error } = await window._supa.auth.signInWithPassword({ email, password });
    return { data, error };
}

/** Sign out */
async function signOut() {
    await window._supa.auth.signOut();
    window.location.href = "index.html";
}

/** Redirect to login if not authenticated */
async function requireAuth() {
    const user = await getUser();
    if (!user) window.location.href = "login.html";
    return user;
}

/** Run a callback once Supabase is ready */
function onSupabaseReady(cb) {
    if (window._supa) { cb(); }
    else { document.addEventListener("supabase:ready", cb, { once: true }); }
}
