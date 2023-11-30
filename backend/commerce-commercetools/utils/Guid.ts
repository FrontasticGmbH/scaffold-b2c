import now from 'performance-now';
export class Guid {
  static newGuid = (
    noHyphens?: boolean,
    [regular, withHyphens] = ['xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx', 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'],
  ) => {
    let d = new Date().getTime();
    if (typeof now === 'function') {
      d += now();
    }

    const shellGuid = noHyphens ? regular : withHyphens;

    return shellGuid.replace(/[xy]/g, function (c) {
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : r & (0x3 | 0x8)).toString(16);
    });
  };

  static empty = '00000000-0000-0000-0000-000000000000';
}
