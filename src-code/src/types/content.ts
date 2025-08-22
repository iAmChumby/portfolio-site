export interface ButtonConfig {
  text: string;
  href: string;
  variant: 'primary' | 'outline' | 'secondary';
  size: 'sm' | 'md' | 'lg';
}

export interface HeroContent {
  title: string;
  name: string;
  subtitle: string;
  description: string;
  buttons: ButtonConfig[];
}

export interface AboutContent {
  title: string;
  subtitle: string;
  bio: string[];
  profile: {
    image?: string;
    initials: string;
    jobTitle: string;
  };
  skills: {
    title: string;
    items: string[];
  };
}

export interface ProjectItem {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  demo: string;
  code: string;
}

export interface ProjectsContent {
  title: string;
  subtitle: string;
  items: ProjectItem[];
  buttons: {
    showMore: string;
    showLess: string;
    loading: string;
    hiding: string;
  };
}

export interface FormField {
  label: string;
  placeholder: string;
  type: 'text' | 'email' | 'textarea';
  required: boolean;
}



export interface ContactContent {
  title: string;
  subtitle: string;
  intro: {
    title: string;
    description: string;
  };
  form: {
    fields: {
      name: FormField;
      email: FormField;
      message: FormField;
    };
    submitButton: string;
  };
}

export interface SiteContent {
  hero: HeroContent;
  about: AboutContent;
  projects: ProjectsContent;
  contact: ContactContent;
}