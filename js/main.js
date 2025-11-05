// main.js
document.addEventListener('DOMContentLoaded', () => {
  // Fill footer year on index (already done in some pages, but safe)
  const y = new Date().getFullYear();
  document.getElementById('year')?.textContent = y;

  // Mask helpers
  const cpfInput = document.getElementById('cpf');
  const telInput = document.getElementById('telefone');
  const cepInput = document.getElementById('cep');

  function setCaretToEnd(el){
    try{ el.selectionStart = el.selectionEnd = el.value.length; } catch(e){}
  }

  function maskCPF(value){
    return value
      .replace(/\D/g,'')
      .slice(0,11)
      .replace(/(\d{3})(\d)/,'$1.$2')
      .replace(/(\d{3})(\d)/,'$1.$2')
      .replace(/(\d{3})(\d{1,2})$/,'$1-$2');
  }

  function maskPhone(value){
    const nums = value.replace(/\D/g,'').slice(0,11);
    if(nums.length <= 2) return nums;
    if(nums.length <= 6) return `(${nums.slice(0,2)}) ${nums.slice(2)}`;
    if(nums.length <= 10) return `(${nums.slice(0,2)}) ${nums.slice(2,6)}-${nums.slice(6)}`;
    return `(${nums.slice(0,2)}) ${nums.slice(2,7)}-${nums.slice(7,11)}`;
  }

  function maskCEP(value){
    return value.replace(/\D/g,'').slice(0,8).replace(/(\d{5})(\d)/,'$1-$2');
  }

  if(cpfInput){
    cpfInput.addEventListener('input', (e) => {
      const old = e.target.value;
      e.target.value = maskCPF(old);
    });
  }

  if(telInput){
    telInput.addEventListener('input', (e) => {
      e.target.value = maskPhone(e.target.value);
    });
  }

  if(cepInput){
    cepInput.addEventListener('input', (e) => {
      e.target.value = maskCEP(e.target.value);
    });
    // Example: auto-fill address via CEP API could be implemented here (requires server or CORS)
  }

  // Form handling
  const form = document.getElementById('registrationForm');
  if(form){
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // Native validity first
      if(!form.checkValidity()){
        form.reportValidity();
        document.getElementById('formMessage').textContent = 'Por favor, corrija os campos obrigatórios.';
        return;
      }
      // Additional custom checks (at least one interest)
      const areas = Array.from(form.querySelectorAll('input[name="areas"]:checked'));
      if(areas.length === 0){
        document.getElementById('formMessage').textContent = 'Selecione pelo menos uma área de interesse.';
        return;
      }

      // Simulação de envio (neste projeto acadêmico; em produção usar fetch para backend)
      const data = new FormData(form);
      const obj = {};
      data.forEach((v,k)=>{ 
        if(obj[k]) {
          if(Array.isArray(obj[k])) obj[k].push(v); else obj[k]=[obj[k],v];
        } else obj[k]=v;
      });

      // Para fins de demo: mostrar mensagem de sucesso
      document.getElementById('formMessage').textContent = 'Cadastro enviado com sucesso! Obrigado.';
      // Reset opcional: form.reset();
      // Para integrar: faça fetch('/api/cadastro', {method:'POST', body: JSON.stringify(obj)})
      console.log('Form submission (simulado):', obj);
    });
  }

  // keyboard focus outlines (improve accessibility)
  (function(){
    const body = document.body;
    function handleFirstTab(e){
      if(e.key === 'Tab'){
        body.classList.add('user-is-tabbing');
        window.removeEventListener('keydown', handleFirstTab);
      }
    }
    window.addEventListener('keydown', handleFirstTab);
  })();
});
