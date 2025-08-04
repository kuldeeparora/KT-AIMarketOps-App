const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/product/BG-NAB12/edit',
  method: 'GET'};

const req = http.request(options, (res) => {
  
  
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    
    
    
    
    
    
    
    
    if (data.includes('Edit Product')) {
      
    } else if (data.includes('Kent Traders')) {
      
    } else {
      
    }
  });
});

req.on('error', (e) => {
  console.error(`❌ Error: ${e.message}`);});

req.end(); 