<script>
    import { supabase } from '$lib/supabaseClient';
    import {goto} from '$app/navigation';
    import {clsx} from 'clsx';
    import Bounded from '$lib/components/Bounded.svelte';
    let email = '';
    let password = '';
    let firstName="";
    let lastName="";
    let role="User";
    let checked = false;
    const handleLogin = async () =>{
        const {error} = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error){
            alert(`Error: ${error.message}`);
        } else {
           
            goto('/profile');
        }
        };

    const handleSignup =async ()=>{
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
 
    });

    if (error) {
      alert(`Error: ${error.message}`);
      return;
    }

    if (data.user) {
      // Create a profile only if user creation was successful
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({ id: data.user.id, email: data.user.email, Role: "Registered", firstName: firstName, lastName: lastName });

      if (profileError) {
        alert(`Error creating profile: ${profileError.message}`);
      } else {
        alert('Signup successful! Check your email for a confirmation link.');
        handleLogin();
        

      
      }
    } else {
      console.error('User creation was not successful.');
    }
   
  };
</script>
<Bounded>
    <div class="login-wrap">
    <div class="login-html">
        <input id="tab-1" type="radio" name="tab" class="sign-in" checked/><label for="tab-1" class="tab">Login</label>
        <input id="tab-2" type="radio" name="tab" class="sign-up"/><label for="tab-2" class="tab">Sign Up</label>
        <div class="login-form">
            <div class="sign-in-htm">
                <div class="group">
                    <label for = "email" class="label">Email</label>
                    <input id="email" bind:value={email} type="text" class="input"/>
                </div>
                <div class="group">
                    <label for = "pass" class="label">Password</label>
                    <input id="pass" bind:value={password} type="password" class="input" data-type="password"/>
            </div>
            <div class="group">
                <button class="button" on:click={handleLogin}>Login</button>
            </div>
        </div>
        <div class="sign-up-htm">
            <div class="group">
                <label for = "firstName" class="label">First Name</label>
                <input id="firstName" bind:value={firstName} type="text" class="input"/>
                <label for = "lastName" class="label">Last Name</label>
                <input id="lastName" bind:value={lastName} type="text" class="input"/>
                <div class="group">
                    <label for="emall" class="label">Email Address</label>
                    <input id="email" bind:value={email} type="text" class="input"/>
                </div>
                <div class="group">
                    <label for = "pass" class="label">Password</label>
                    <input id="pass" bind:value={password} type="password" class="input" data-type="password"/>
            </div>
          
                <input type="checkbox" class="check" id="check" checked/>
                <label for="check"><span class="icon"></span> I agree to the <a href="#">terms and conditions</a></label>
            </div>
            <div class="group">
                <button on:click={handleSignup} class="button">Sign Up</button>
            </div>
        </div>
        
    </div>
</Bounded>
<style>
   

.login-wrap{
	width:100%;
	margin:auto;
	max-width:625px;
	min-height:770px;
	position:relative;
	background:url(/assets/form-background.webp) no-repeat center;
	box-shadow:0 12px 15px 0 rgba(0,0,0,.24),0 17px 50px 0 rgba(0,0,0,.19);
}
.login-html{
	width:100%;
	height:100%;
	position:absolute;
	padding:90px 70px 50px 70px;
	@apply bg-surface-900/60;
}
.login-html .sign-in-htm,
.login-html .sign-up-htm{
	top:0;
	left:0;
	right:0;
	bottom:0;
	position:absolute;
	transform:rotateY(180deg);
	backface-visibility:hidden;
	transition:all .4s linear;
}
.login-html .sign-in,
.login-html .sign-up,
.login-form .group .check{
	display:none;
}
.login-html .tab,
.login-form .group .label,
.login-form .group .button{
	text-transform:uppercase;
}
.login-html .tab{
	font-size:22px;
	margin-right:15px;
	padding-bottom:5px;
	margin:0 15px 10px 0;
	display:inline-block;
	border-bottom:2px solid transparent;
}
.login-html .sign-in:checked + .tab,
.login-html .sign-up:checked + .tab{
	
	@apply text-2xl font-extrabold tracking-wider text-secondary-300 border-secondary-500;
}
.login-form{
	min-height:345px;
	position:relative;
	perspective:1000px;
	transform-style:preserve-3d;
}
.login-form .group{
   @apply py-6;
	
}
.login-form .group .label,
.login-form .group .input,
.login-form .group .button{
	width:100%;
	@apply text-secondary-900 text-xl font-extrabold tracking-wider;
	display:block;
}
.login-form .group .input,
.login-form .group .button{
	border:none;
	padding:15px 20px;
	border-radius:25px;
	@apply bg-primary-400/50;
}
.login-form .group input[data-type="password"]{
	-webkit-text-security:circle;
	-webkit-text-security:circle;
}
.login-form .group .label{
	@apply text-xl text-secondary-200 font-extrabold tracking-wider ;
}
.login-form .group .button{ 
	@apply bg-primary-500;
}

	


.login-html .sign-in:checked + .tab + .sign-up + .tab + .login-form .sign-in-htm{
	transform:rotate(0);
}
.login-html .sign-up:checked + .tab + .login-form .sign-up-htm{
	transform:rotate(0);
}


</style>