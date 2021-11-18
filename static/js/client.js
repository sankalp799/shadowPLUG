window.onload = () => {
    if(location.pathname.split('/')[1] == 'join'){
        let id = window.location.pathname.split('/');
        id = id[id.length - 1];
        document.querySelector('.route-heading').innerHTML += `<br /> <h6>${id}</h6>`;
        sessionStorage.setItem('id', id);
        console.log('form action: /' + id);
        document.querySelector('form').action = '/' + id;
        
        let avatar_url = 'https://avatars.dicebear.com/api/open-peeps/';
        let avatar_viewer = document.querySelector('#form-avatar');
        let joinForm = document.querySelector('form');
        let username_field = document.getElementById('username-input')
        
        username_field.addEventListener('keypress', evt => {
            avatar_viewer.src = avatar_url + username_field.value + '.svg';
        });

        joinForm.addEventListener('submit', evt => {
            let formElement = joinForm.elements;
            let username = formElement[0].value;
            sessionStorage.setItem('username', username.toString());
        });
    }
    
    if(location.pathname.split('/')[1] == ''){
        document.querySelector('#createRoomBtn').addEventListener('click', (evt) => {
            evt.preventDefault();
            let requestURL = new Request(location.origin + '/api/v1/room/create');
            let h = new Headers();
            h.append('Accept', 'application/json');
            fetch(requestURL, {
                method: 'POST',
                headers: h,
            })
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    sessionStorage.setItem('id', data.id);
                    document.getElementById('roomLink').innerText = data.link;
                })
                .catch(err => {
                    document.getElementById('link_view').innerText = 'Server Not Responding';
                })
        });
    }
}
