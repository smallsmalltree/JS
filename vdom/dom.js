const prevVNode = createElement('div', null, [
    createElement('p', { key: 'a' ,style:{color:'blue'}}, ['序列1']),
    createElement('p', { key: 'b' ,'@click':()=>{alert('原值')}}, ['序列2']),
    createElement('p', { key: 'c' }, ['序列3']),
    createElement('p', { key: 'd'}, ['序列4']),
  ])

  const nextVNode = createElement('div', null, [
    createElement('p', { key: 'd' }, ['序列4']),
    createElement('p', { key: 'a' ,style:{color:'red'}}, ['序列1']),
    createElement('p', { key: 'b' ,'@click':()=>{alert('现值')}}, ['序列2']),
    createElement('p', { key: 'f' }, ['序列6']),
    createElement('p', { key: 'e' ,class:"header"}, ['序列5']),
  ])
  
render(prevVNode, document.getElementById('app'))
console.log(nextVNode);
console.log(prevVNode);
setTimeout(()=>render(nextVNode,document.getElementById('app')),2000)