<script>
    import {Router, Route} from "svelte-routing";
    import Home from "./lib/routes/Home.svelte";
    import Help from "./lib/routes/Help.svelte";
</script>

<main>
    <Router>
        <Route path="/" component={Home}/>
        <Route path="/help" component={Help}/>
    </Router>
</main>
