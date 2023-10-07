<nav class="top">
    <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
    </ul>
</nav>

<main>
    <aside>
        <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
        </ul>
    </aside>
    <slot></slot>
</main>

<style>
    :global(body > div) {
        /* height: 100%; */
        display: flex;
        flex-direction: column;
        margin: 0;
        padding: 0;
    }
    main {
        flex-grow: 1;
        display: flex;
        flex-direction: row;
        max-width: 100%;
    }
    :global(.main) {
        margin: 10px;
        height: calc(100% - 20px);
        width: calc(100% - 20px);
        max-width: calc(100% - 100px);
        max-height: calc(100vh - 76px);
    }

   

    nav {
        background-color: #333;
        color: #fff;
        padding: 1rem;
    }

    nav ul {
        display: flex;
        list-style: none;
        margin: 0;
        padding: 0;
    }

    nav ul li {
        margin-right: 1rem;
    }

    nav ul li a {
        color: #fff;
        text-decoration: none;
    }

    /* main {
        padding: 1rem;
    }  */
</style>