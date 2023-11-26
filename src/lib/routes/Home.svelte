<script>

import NavMenu from "../NavMenu.svelte";
import TuiCalendar from "../components/TuiCalendar.svelte";
</script>
<svelte:head>
    <title>Index</title>
</svelte:head>

<div class="wrapper home">
    <TuiCalendar></TuiCalendar>
</div>

<style lang="scss">
  @import '../../styles/pages/home';
</style>