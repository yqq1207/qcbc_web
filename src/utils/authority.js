// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority() {
  return localStorage.getItem('antd-pro-authority') || 'admin';
}

export function getUserName() {
  return localStorage.getItem('userName') || '';
}

export function setAuthority(authority) {
  return localStorage.setItem('antd-pro-authority', authority);
}

export function setUserName(authority) {
  return localStorage.setItem('userName', authority);
}
