const ws = new WebSocket(`wss://${window.location.host}`);

navigator.geolocation.getCurrentPosition((position) => {
    const la = (position.coords.latitude).toFixed(1);
    const lo = (position.coords.longitude).toFixed(1);

    const option = {
        type      : 'GET_POSITION',
        name      : la+'/'+lo,
        latitude  : la,
        longitude : lo
    }
    ws.send(JSON.stringify(option));
});

ws.addEventListener('open', (socket) => {
    console.log('Connection ✅');
});
ws.addEventListener('message', ({data}) => {
    const rt  = JSON.parse(data);
    console.log(rt);
    const key = rt.key;
    document.querySelector('#id').innerText = key;
    document.querySelector('#msg-wrap').innerHTML = '';
    rt.list.forEach(item => {
        const ele   = document.createElement('li');
        const p     = document.createElement('p');
        p.innerText = item.name;
        ele.append(p);
        document.querySelector('#msg-wrap').append(ele);
    })
});
ws.addEventListener('close', (socket) => {
    console.log('Connection ❌');
});

const btn = document.querySelector('#send-btn');
const inp = document.querySelector('#input');

const handleSendMsg = () => {
    ws.send(inp.value);
    inp.value = '';
}

inp.addEventListener('keydown', (e) => {
    if(e.keyCode === 13){
        handleSendMsg();
    }
});
btn.addEventListener('click', handleSendMsg);