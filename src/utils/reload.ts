export const reload = (msg: string) => {
  if (window.confirm(msg)) {
    window.location.reload();
  } else {
    window.location.reload();
  }
};
