window.onload = () => {
    let id = window.location.pathname.split('/');
    id = id[id.length - 1];
    console.log('form action: /' + id);
    document.querySelector('form').action = '/' + id;
}
