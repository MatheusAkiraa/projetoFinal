// Modal 
const btnLogin = document.getElementById('btnLogin');
const btnFechar = document.getElementById('btnFechar');
const login = document.getElementById('login');
const formLogin = document.querySelector('#login form');

// Criando usuários para teste
let dadosUsuarios = [
    { nome: "user", email: "email@email.com", senha: "123" },
    { nome: "aluno", email: "aluno@email.com", senha: "aluno" },
    { nome: "root", email: "root@email.com", senha: "root" },
];

btnLogin.onclick = function () {
    login.showModal();
};

btnFechar.onclick = function () {
    login.close();
};

formLogin.addEventListener('submit', (evento) => {
    evento.preventDefault();

    // Remover Mensgem de erro se houver
    let msgErro = document.querySelector('.erro');
    if (msgErro) {
        login.removeChild(msgErro);
    }

    // Verificar se o usuário existe
    let email = document.getElementById('email').value;
    let senha = document.getElementById('senha').value;

    dadosUsuarios.forEach(item => {
        if (email === item.email && senha === item.senha) {
            // Criando sessões para armazenar informações
            sessionStorage.setItem('usuarioLogado', 'true');
            sessionStorage.setItem('nomeUsuario', item.nome);

            window.location.href = "./admin/index.html";
        }
    });

    // Criando mensagem de erro
    let usuarioLogado = sessionStorage.getItem('usuarioLogado');

    if (!usuarioLogado) {
        erro = document.createElement('p');
        erro.classList.add('erro');
        erro.innerText = 'Login ou senha inválido';
        login.insertBefore(erro, login.firstChild);
        document.querySelector('#login form').reset();
    }
});
