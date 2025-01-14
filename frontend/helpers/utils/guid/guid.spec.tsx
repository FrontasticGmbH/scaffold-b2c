import { Guid } from './';

describe('Guid', () => {
  describe('newGuid', () => {
    it('should generate a GUID without hyphens when noHyphens is true', () => {
      const guid = Guid.newGuid(true);
      expect(guid).toMatch(/^[a-f0-9]{32}$/i);
    });

    it('should generate unique GUIDs', () => {
      const guid1 = Guid.newGuid();
      const guid2 = Guid.newGuid();
      expect(guid1).not.toBe(guid2);
    });

    it('should generate a valid GUID even with a custom template', () => {
      const customTemplate: [string, string] = ['xxxxxxxyxxxx', 'xxxx-xxx-xxxx'];
      const guid = Guid.newGuid(false, customTemplate);
      expect(guid).toMatch(/^[a-f0-9]{4}-[a-f0-9]{3}-[a-f0-9]{4}$/i);
    });

    it('should generate a valid GUID with noHyphens and a custom template', () => {
      const customTemplate: [string, string] = ['xxxxxxxyxxxx', 'xxxx-xxxy-xxxx'];
      const guid = Guid.newGuid(true, customTemplate);
      expect(guid).toMatch(/^[a-f0-9]{12}$/i);
    });
  });

  describe('empty', () => {
    it('should return the correct empty GUID string', () => {
      expect(Guid.empty).toBe('00000000-0000-0000-0000-000000000000');
    });

    it('should have the correct length for an empty GUID', () => {
      expect(Guid.empty.length).toBe(36);
    });
  });
});
