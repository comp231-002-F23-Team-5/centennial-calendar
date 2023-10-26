<script>
    import {Router, Route} from "svelte-routing";
    import Home from "./lib/routes/Home.svelte";
</script>

<main>
    <Router>
        <Route path="/" component={Home}/>
    </Router>
</main>
