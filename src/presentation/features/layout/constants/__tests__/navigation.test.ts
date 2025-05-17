import { DEVELOPER_DOCS_NAV_ITEMS, NAV_SECTIONS, PLATFORM_NAV_ITEMS } from '../navigation';

describe('Navigation Constants', () => {
  describe('DEVELOPER_DOCS_NAV_ITEMS', () => {
    it('should contain documentation navigation items', () => {
      expect(DEVELOPER_DOCS_NAV_ITEMS).toHaveLength(1);

      // Check for Documentation Hub
      expect(DEVELOPER_DOCS_NAV_ITEMS[0].name).toBe('Documentation Hub');
      expect(DEVELOPER_DOCS_NAV_ITEMS[0].to).toBe('/docs');
    });
  });

  describe('PLATFORM_NAV_ITEMS', () => {
    it('should contain Platform Settings with correct sub-items', () => {
      const platformSettings = PLATFORM_NAV_ITEMS.find((item) => item.name === 'Platform Settings');
      expect(platformSettings).toBeDefined();
      expect(platformSettings?.subItems).toHaveLength(1);

      const modelsItem = platformSettings?.subItems?.[0];
      expect(modelsItem?.name).toBe('Models');
      expect(modelsItem?.['data-testid']).toBe('models-settings');
    });
  });

  describe('NAV_SECTIONS', () => {
    it('should include platform section', () => {
      expect(NAV_SECTIONS.platform.title).toBe('Platform');
      expect(NAV_SECTIONS.platform.items).toBe(PLATFORM_NAV_ITEMS);
    });

    it('should include developer docs section', () => {
      expect(NAV_SECTIONS.developerDocs.title).toBe('Developer Docs');
      expect(NAV_SECTIONS.developerDocs.items).toBe(DEVELOPER_DOCS_NAV_ITEMS);
    });
  });
});
