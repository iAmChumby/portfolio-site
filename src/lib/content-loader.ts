import { SiteContent } from '@/types/content';
import contentData from '@/data/content.json';
import siteConfig from '@/data/site-config.json';

/**
 * Content loader utility for managing site content from JSON files
 */
export class ContentLoader {
  private static instance: ContentLoader;
  private content: SiteContent;

  private constructor() {
    this.content = contentData as SiteContent;
  }

  /**
   * Get singleton instance of ContentLoader
   */
  public static getInstance(): ContentLoader {
    if (!ContentLoader.instance) {
      ContentLoader.instance = new ContentLoader();
    }
    return ContentLoader.instance;
  }

  /**
   * Get all content
   */
  public getContent(): SiteContent {
    return this.content;
  }

  /**
   * Get hero section content
   */
  public getHeroContent() {
    return this.content.hero;
  }

  /**
   * Get about section content
   */
  public getAboutContent() {
    return this.content.about;
  }

  /**
   * Get projects section content
   */
  public getProjectsContent() {
    return this.content.projects;
  }

  /**
   * Get contact section content
   */
  public getContactContent() {
    return this.content.contact;
  }

  /**
   * Get site configuration (from existing site-config.json)
   */
  public getSiteConfig() {
    return siteConfig;
  }

  /**
   * Validate content structure (basic validation)
   */
  public validateContent(): boolean {
    try {
      const requiredSections = ['hero', 'about', 'projects', 'contact'];
      
      for (const section of requiredSections) {
        if (!(section in this.content)) {
          console.error(`Missing required section: ${section}`);
          return false;
        }
      }

      // Validate hero section
      const hero = this.content.hero;
      if (!hero.greeting || !hero.name || !hero.tagline || !hero.description || !Array.isArray(hero.buttons)) {
        console.error('Invalid hero section structure');
        return false;
      }

      // Validate projects section
      const projects = this.content.projects;
      if (!Array.isArray(projects.items) || projects.items.length === 0) {
        console.error('Invalid projects section structure');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Content validation error:', error);
      return false;
    }
  }
}

/**
 * Convenience functions for direct access
 */
export const getContent = () => ContentLoader.getInstance().getContent();
export const getHeroContent = () => ContentLoader.getInstance().getHeroContent();
export const getAboutContent = () => ContentLoader.getInstance().getAboutContent();
export const getProjectsContent = () => ContentLoader.getInstance().getProjectsContent();
export const getContactContent = () => ContentLoader.getInstance().getContactContent();
export const getSiteConfig = () => ContentLoader.getInstance().getSiteConfig();
export const validateContent = () => ContentLoader.getInstance().validateContent();