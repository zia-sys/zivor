const SUPABASE_URL="https://iwmerosfwaklwqavpkqo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY="sb_publishable_oDqESMDyn4bockDNDOrxGw_VVtv7P6X";
const supabaseClient=window.supabase.createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});

const form=document.getElementById("authForm");
const emailInput=document.getElementById("authEmail");
const passwordInput=document.getElementById("authPassword");
const confirmInput=document.getElementById("authConfirm");
const nameInput=document.getElementById("authName");
const submitBtn=document.getElementById("authSubmit");
const message=document.getElementById("authMessage");
const title=document.getElementById("authTitle");
const subtitle=document.getElementById("authSubtitle");
const switchText=document.getElementById("authSwitchText");
const switchBtn=document.getElementById("authSwitch");
const confirmWrap=document.getElementById("confirmWrap");
const nameWrap=document.getElementById("nameWrap");
const forgotBtn=document.getElementById("forgotPassword");
const modeNote=document.getElementById("modeNote");

let mode="signup";
const HOME_PAGE="index.html";

function redirectHome(){
  window.location.replace(HOME_PAGE);
}

function setMode(m){
  mode=m;
  const s=m==="signup";
  title.textContent=s?"Create your ZIVOR account":"Welcome back";
  subtitle.textContent=s?"Sign up with your email and password to continue to the website.":"Sign in to continue to ZIVOR.";
  submitBtn.textContent=s?"Create Account":"Sign In";
  switchText.textContent=s?"Already have an account?":"Don't have an account?";
  switchBtn.textContent=s?"Sign In":"Create Account";
  confirmWrap.style.display=s?"block":"none";
  nameWrap.style.display=s?"block":"none";
  forgotBtn.style.display=s?"none":"inline-flex";
  modeNote.textContent=s?"Password must be at least 8 characters.":"Use the email and password you registered with.";
  message.textContent="";
}

switchBtn.addEventListener("click",()=>setMode(mode==="signup"?"signin":"signup"));

forgotBtn.addEventListener("click",async()=>{
  const e=(emailInput.value||"").trim();
  if(!e){
    message.textContent="Enter your email first, then click Forgot password.";
    return;
  }
  const {error}=await supabaseClient.auth.resetPasswordForEmail(e,{redirectTo:new URL("auth.html#reset",location.href).href});
  message.textContent=error?error.message:"If an account exists for that email, a password reset email has been sent.";
});

form.addEventListener("submit",async e=>{
  e.preventDefault();

  const email=(emailInput.value||"").trim().toLowerCase();
  const password=passwordInput.value||"";

  submitBtn.disabled=true;
  message.textContent="Please wait...";

  try{
    if(password.length<8) throw new Error("Your password must be at least 8 characters.");

    if(mode==="signup"){
      if(password!==confirmInput.value) throw new Error("Passwords do not match.");

      const {data,error}=await supabaseClient.auth.signUp({
        email,
        password,
        options:{
          data:{full_name:(nameInput.value||"").trim()},
          emailRedirectTo:new URL("index.html",location.href).href
        }
      });

      if(error) throw error;

      // With Supabase Confirm Email disabled, signUp returns a session
      // and the user can enter the website immediately.
      if(data.session){
        redirectHome();
        return;
      }

      message.textContent="Account created, but email confirmation is still enabled in Supabase. Disable Confirm Email in Authentication → Providers → Email, then users will be redirected automatically.";
    }else if(mode==="signin"){
      const {data,error}=await supabaseClient.auth.signInWithPassword({email,password});

      if(error){
        if((error.message||"").toLowerCase().includes("email not confirmed")){
          throw new Error("Email confirmation is enabled in Supabase. Disable Confirm Email in Authentication → Providers → Email to allow immediate sign-in.");
        }
        throw error;
      }

      if(data.session){
        redirectHome();
        return;
      }
    }else{
      if(password!==confirmInput.value) throw new Error("Passwords do not match.");
      const {error}=await supabaseClient.auth.updateUser({password});
      if(error) throw error;
      message.textContent="Password updated. Redirecting...";
      setTimeout(redirectHome,500);
    }
  }catch(err){
    message.textContent=err.message||"Something went wrong. Please try again.";
  }finally{
    submitBtn.disabled=false;
  }
});

supabaseClient.auth.onAuthStateChange((event,session)=>{
  if(session && mode!=="signup" && !location.hash.startsWith("#reset")){
    redirectHome();
  }
});

if(location.hash==="#reset"){
  mode="reset";
  title.textContent="Set a new password";
  subtitle.textContent="Choose a new password with at least 8 characters.";
  confirmWrap.style.display="block";
  nameWrap.style.display="none";
  submitBtn.textContent="Update Password";
  switchBtn.style.display="none";
  switchText.style.display="none";
  forgotBtn.style.display="none";
  modeNote.textContent="Your new password must be at least 8 characters.";
}else{
  setMode("signup");
  (async()=>{
    const {data:{session}}=await supabaseClient.auth.getSession();
    if(session) redirectHome();
  })();
}
