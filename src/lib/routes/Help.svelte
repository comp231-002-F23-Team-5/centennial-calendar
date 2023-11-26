<script>
import {Img} from 'flowbite-svelte';
import emailjs from 'emailjs-com';
import { PersonCircle } from "svelte-bootstrap-icons";

var responseMsg = "";

function onSubmit(e){
  emailjs.sendForm('12077159','template_gfxps7t', '#help-form', 'fUeRvqWtT_ztCBgcX')
	.then(function(response) {
	   console.log('SUCCESS!', response.status, response.text);
     responseMsg = "Help form is submitted successfully!";
	}, function(err) {
	   console.log('FAILED...', err);
     responseMsg = "Help form is failed to submit...";
	});
}
</script>

<svelte:head>
    <title>eCentennial Calendar - Help Form</title>
</svelte:head>
<div class="flex-container">
  <div class="button-cal-wrapper">
      <a href="https://www.centennialcollege.ca/" target="_blank"><Img src="src/assets/logo.jpeg" width="120" 
      height="40" alt="logo" /></a>
      <div><p>eCentennial Calendar - Help Form</p></div>
  </div>
  <div class="button-tool-wrapper">
      <PersonCircle width="60" height="40" />
      <div>Sophia Laxman</div>
  </div>
</div>
<!-- Form Section-->
<div class="form-container">
  <div class="cta-form">
    <h2>Fill out the form to get help!</h2> 
    <p>Submit the help form and our IT support team will contact you by email soon.</p>
    <div class="responseMsg">{responseMsg}</div>
  </div>
  <form id="help-form" on:submit|preventDefault={onSubmit} class="form">
    
    <input type="text" placeholder="Name" class="form__input" id="name" name="name" value="Sophia Laxman" required>
    <label for="name" class="form__label">Name</label>

    <input type="email" placeholder="Email" class="form__input" id="email" name="email" value="sophial244@my.centennialcollege.ca" required/>
    <label for="email" class="form__label">Email</label>

    <input type="text" placeholder="Phone" class="form__input" name="phone" id="phone" required/>
    <label for="subject" class="form__label">Phone</label>

    <input type="text" placeholder="Subject" class="form__input" name="subject" id="subject" required>
    <label for="subject" class="form__label">Subject</label>

    <textarea placeholder="Description" class="form__input form__input__textarea" name="description" id="description" rows="4" cols="50" required/>
    <label for="subject" class="form__label">Description</label>
    
    <input type="hidden" name="ticketid" id="ticketid" value="{Date.now()}"/>
    <input class="form__submit" type="submit" value="Submit"/>
  </form>
</div>


<style lang="scss">
  @import '../../styles/pages/home';
  @import '../../styles/pages/help';
</style>