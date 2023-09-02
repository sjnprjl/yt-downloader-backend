export function ytResponseStatus(response: string) {
  const lowerCaseResponse = response.toLocaleLowerCase();

  if (lowerCaseResponse.includes('warning')) {
    return 'warning';
  } else if (lowerCaseResponse.includes('error')) {
    return 'error';
  } else {
    return 'unknown';
  }
}
