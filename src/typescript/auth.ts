export function initializeAuthPopup() {
    const authPopup = document.getElementById('auth-popup') as HTMLElement;
    const loginForm = document.getElementById('login-form') as HTMLElement;
    const registerForm = document.getElementById('register-form') as HTMLElement;
    const tabs = document.querySelectorAll('.auth-tabs .tab') as NodeListOf<HTMLElement>;
    const closeBtn = document.querySelector('.auth-popup .close-btn') as HTMLElement;
  
    
    const loginBtn = document.querySelector('.login-btn') as HTMLElement;
    const registerBtn = document.querySelector('.register-btn') as HTMLElement;

    checkSession();
  
    // Event listeners for login and register button
    if (loginBtn) {
      loginBtn.addEventListener('click', () => {
        authPopup.style.display = 'flex';
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        tabs.forEach(tab => tab.classList.remove('active'));
        tabs[0].classList.add('active');
      });
    }
  
    // Event listeners for register button
    if (registerBtn) {
      registerBtn.addEventListener('click', () => {
        authPopup.style.display = 'flex';
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        tabs.forEach(tab => tab.classList.remove('active'));
        tabs[1].classList.add('active');
      });
    }
  
    closeBtn.addEventListener('click', () => {
      authPopup.style.display = 'none';
    });
  
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        if (tab.dataset.tab === 'login') {
          loginForm.style.display = 'block';
          registerForm.style.display = 'none';
        } else {
          loginForm.style.display = 'none';
          registerForm.style.display = 'block';
        }
      });
    });
  
    loginForm.querySelector('form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = (loginForm.querySelector('input[type="text"]') as HTMLInputElement).value;
      const password = (loginForm.querySelector('input[type="password"]') as HTMLInputElement).value;
      try {
        const response = await fetch('/api/user/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email, password })
        });
        const result = await response.json();
        if (response.ok) {
          alert('Login successful');
          authPopup.style.display = 'none';
          updateHeader(result.user);
        } else {
          alert(result.message || 'Login failed');
        }
      } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred');
      }
    });
  
    registerForm.querySelector('form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = (registerForm.querySelector('input[type="text"]') as HTMLInputElement).value;
      const email = (registerForm.querySelector('input[type="email"]') as HTMLInputElement).value;
      const password = (registerForm.querySelector('input[type="password"]') as HTMLInputElement).value;
      try {
        const response = await fetch('/api/user/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });
        const result = await response.json();
        if (response.ok) {
          alert('Registration successful');
          authPopup.style.display = 'none';
          updateHeader({ name, email, user_id: result.user_id });
        } else {
          alert(result.message || 'Registration failed');
        }
      } catch (error) {
        console.error('Registration error:', error);
        alert('An error occurred');
      }
    });
  }

  function checkSession() {
     fetch('/api/session', {
      credentials: 'include'
    })
      .then(response => {
        console.log('Current user response status:', response.status); // Debug response
        return response.json();
      })
      .then(data => {
        console.log('Current user data:', data); // Debug data
        if (data.user) {
          updateHeader(data.user);
        } 
        else {
          updateHeader(null);
        }
      })
      .catch(error => {
        console.error('Error checking session:', error);
        updateHeader(null);
      });
}


function updateHeader(user: { name: string, email: string, user_id: string } | null) {
  const userPanel = document.querySelector('.nav-right');
  if (userPanel) {
    console.log("User", user);
    if (user) {
      userPanel.innerHTML = `
        <div class="avatar">
          <span>${user.name}</span>
        </div>
        <button class="logout-btn">Logout</button>`;
        userPanel.querySelector(".logout-btn")?.addEventListener('click', function() {logout()} )
    } else {
      userPanel.innerHTML = `
        <button class="login-btn" onclick="document.querySelector('#auth-popup').style.display = 'flex';">Sign in</button>
        <button class="register-btn" onclick="document.querySelector('#auth-popup').style.display = 'flex';">Sign up</button>`;
    }
  }
}

function logout() {
  fetch('/api/user/logout', {
    method: 'POST',
    credentials: 'include'
  })
    .then(response => response.json())
    .then(data => {
      alert(data.message);
      updateHeader(null);
    })
    .catch(error => {
      console.error('Logout error:', error);
      alert('An error occurred during logout');
    });
}