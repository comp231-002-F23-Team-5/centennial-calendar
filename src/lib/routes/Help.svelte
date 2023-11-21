<script>

import NavMenu from "../NavMenu.svelte";
import {Img, Button, Dropdown, DropdownItem} from 'flowbite-svelte';
var postmark = require("postmark");

// Send an email:
var client = new postmark.ServerClient("POSTMARK-SERVER-API-TOKEN-HERE");

client.sendEmail({
  "From": "sender@example.com",
  "To": "recipient@example.com",
  "Subject": "Test",
  "TextBody": "Hello from Postmark!"
});
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
      <Img src="src/assets/user.png" width="60" height="40" alt="logo" />
      <div>Sophia Laxman</div>
  </div>
</div>
<!-- Form Section-->
<div class="form-container">
  <div class="cta-form">
    <h2>Fill out the form to get help!</h2> 
  <p>Submit the help form and our IT support team will contact you by email soon.</p>
  </div>
  <form action="" class="form">
    
    <input type="text" placeholder="Name" class="form__input" id="name" value="Sophia Laxman">
    <label for="name" class="form__label">Name</label>

    <input type="email" placeholder="Email" class="form__input" id="email" value="sophial244@my.centennialcollege.ca"/>
    <label for="email" class="form__label">Email</label>

    <input type="text" placeholder="Phone" class="form__input" id="phone" />
    <label for="subject" class="form__label">Phone</label>

    <input type="text" placeholder="Subject" class="form__input" id="subject" >
    <label for="subject" class="form__label">Subject</label>

    <textarea placeholder="Description" class="form__input form__input__textarea" id="description" rows="4" cols="50"/>
    <label for="subject" class="form__label">Description</label>
    
    <input class="form__submit" type="submit" value="Submit"/>
  </form>
</div>


<style lang="scss">
  @import '../../styles/pages/home';
  @import '../../styles/pages/help';
</style>