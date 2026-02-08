/**
 * Internationalization (i18n) system for Nexus SaaS
 * Supports English and other languages with easy extensibility
 */

export type Locale = "en" | "es" | "fr" | "de" | "ar" | "hi";

export const locales: Locale[] = ["en", "es", "fr", "de", "ar", "hi"];
export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  ar: "العربية",
  hi: "हिंदी",
};

export const rtlLocales: Locale[] = ["ar"];

// Translation dictionary type
export type TranslationKey =
  | "common.save"
  | "common.cancel"
  | "common.delete"
  | "common.edit"
  | "common.create"
  | "common.search"
  | "common.loading"
  | "common.error"
  | "common.success"
  | "nav.dashboard"
  | "nav.projects"
  | "nav.tasks"
  | "nav.crm"
  | "nav.finance"
  | "nav.hr"
  | "nav.inventory"
  | "nav.settings"
  | "auth.login"
  | "auth.logout"
  | "auth.signup"
  | "auth.forgotPassword"
  | "dashboard.welcome"
  | "dashboard.totalRevenue"
  | "dashboard.activeProjects"
  | "dashboard.totalClients";

type Translations = Record<TranslationKey, string>;

const translations: Record<Locale, Translations> = {
  en: {
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.create": "Create",
    "common.search": "Search",
    "common.loading": "Loading...",
    "common.error": "An error occurred",
    "common.success": "Success!",
    "nav.dashboard": "Dashboard",
    "nav.projects": "Projects",
    "nav.tasks": "Tasks",
    "nav.crm": "CRM",
    "nav.finance": "Finance",
    "nav.hr": "HR",
    "nav.inventory": "Inventory",
    "nav.settings": "Settings",
    "auth.login": "Log in",
    "auth.logout": "Log out",
    "auth.signup": "Sign up",
    "auth.forgotPassword": "Forgot password?",
    "dashboard.welcome": "Welcome back",
    "dashboard.totalRevenue": "Total Revenue",
    "dashboard.activeProjects": "Active Projects",
    "dashboard.totalClients": "Total Clients",
  },
  es: {
    "common.save": "Guardar",
    "common.cancel": "Cancelar",
    "common.delete": "Eliminar",
    "common.edit": "Editar",
    "common.create": "Crear",
    "common.search": "Buscar",
    "common.loading": "Cargando...",
    "common.error": "Ocurrió un error",
    "common.success": "¡Éxito!",
    "nav.dashboard": "Panel",
    "nav.projects": "Proyectos",
    "nav.tasks": "Tareas",
    "nav.crm": "CRM",
    "nav.finance": "Finanzas",
    "nav.hr": "RRHH",
    "nav.inventory": "Inventario",
    "nav.settings": "Configuración",
    "auth.login": "Iniciar sesión",
    "auth.logout": "Cerrar sesión",
    "auth.signup": "Registrarse",
    "auth.forgotPassword": "¿Olvidaste tu contraseña?",
    "dashboard.welcome": "Bienvenido de nuevo",
    "dashboard.totalRevenue": "Ingresos Totales",
    "dashboard.activeProjects": "Proyectos Activos",
    "dashboard.totalClients": "Total de Clientes",
  },
  fr: {
    "common.save": "Enregistrer",
    "common.cancel": "Annuler",
    "common.delete": "Supprimer",
    "common.edit": "Modifier",
    "common.create": "Créer",
    "common.search": "Rechercher",
    "common.loading": "Chargement...",
    "common.error": "Une erreur est survenue",
    "common.success": "Succès !",
    "nav.dashboard": "Tableau de bord",
    "nav.projects": "Projets",
    "nav.tasks": "Tâches",
    "nav.crm": "CRM",
    "nav.finance": "Finance",
    "nav.hr": "RH",
    "nav.inventory": "Inventaire",
    "nav.settings": "Paramètres",
    "auth.login": "Connexion",
    "auth.logout": "Déconnexion",
    "auth.signup": "S'inscrire",
    "auth.forgotPassword": "Mot de passe oublié ?",
    "dashboard.welcome": "Bon retour",
    "dashboard.totalRevenue": "Revenu Total",
    "dashboard.activeProjects": "Projets Actifs",
    "dashboard.totalClients": "Total Clients",
  },
  de: {
    "common.save": "Speichern",
    "common.cancel": "Abbrechen",
    "common.delete": "Löschen",
    "common.edit": "Bearbeiten",
    "common.create": "Erstellen",
    "common.search": "Suchen",
    "common.loading": "Laden...",
    "common.error": "Ein Fehler ist aufgetreten",
    "common.success": "Erfolg!",
    "nav.dashboard": "Dashboard",
    "nav.projects": "Projekte",
    "nav.tasks": "Aufgaben",
    "nav.crm": "CRM",
    "nav.finance": "Finanzen",
    "nav.hr": "Personal",
    "nav.inventory": "Inventar",
    "nav.settings": "Einstellungen",
    "auth.login": "Anmelden",
    "auth.logout": "Abmelden",
    "auth.signup": "Registrieren",
    "auth.forgotPassword": "Passwort vergessen?",
    "dashboard.welcome": "Willkommen zurück",
    "dashboard.totalRevenue": "Gesamtumsatz",
    "dashboard.activeProjects": "Aktive Projekte",
    "dashboard.totalClients": "Kunden Gesamt",
  },
  ar: {
    "common.save": "حفظ",
    "common.cancel": "إلغاء",
    "common.delete": "حذف",
    "common.edit": "تعديل",
    "common.create": "إنشاء",
    "common.search": "بحث",
    "common.loading": "جاري التحميل...",
    "common.error": "حدث خطأ",
    "common.success": "نجاح!",
    "nav.dashboard": "لوحة التحكم",
    "nav.projects": "المشاريع",
    "nav.tasks": "المهام",
    "nav.crm": "إدارة العملاء",
    "nav.finance": "المالية",
    "nav.hr": "الموارد البشرية",
    "nav.inventory": "المخزون",
    "nav.settings": "الإعدادات",
    "auth.login": "تسجيل الدخول",
    "auth.logout": "تسجيل الخروج",
    "auth.signup": "إنشاء حساب",
    "auth.forgotPassword": "نسيت كلمة المرور؟",
    "dashboard.welcome": "مرحباً بعودتك",
    "dashboard.totalRevenue": "إجمالي الإيرادات",
    "dashboard.activeProjects": "المشاريع النشطة",
    "dashboard.totalClients": "إجمالي العملاء",
  },
  hi: {
    "common.save": "सहेजें",
    "common.cancel": "रद्द करें",
    "common.delete": "हटाएं",
    "common.edit": "संपादित करें",
    "common.create": "बनाएं",
    "common.search": "खोजें",
    "common.loading": "लोड हो रहा है...",
    "common.error": "एक त्रुटि हुई",
    "common.success": "सफलता!",
    "nav.dashboard": "डैशबोर्ड",
    "nav.projects": "परियोजनाएं",
    "nav.tasks": "कार्य",
    "nav.crm": "सीआरएम",
    "nav.finance": "वित्त",
    "nav.hr": "मानव संसाधन",
    "nav.inventory": "इन्वेंटरी",
    "nav.settings": "सेटिंग्स",
    "auth.login": "लॉग इन करें",
    "auth.logout": "लॉग आउट करें",
    "auth.signup": "साइन अप करें",
    "auth.forgotPassword": "पासवर्ड भूल गए?",
    "dashboard.welcome": "वापसी पर स्वागत है",
    "dashboard.totalRevenue": "कुल राजस्व",
    "dashboard.activeProjects": "सक्रिय परियोजनाएं",
    "dashboard.totalClients": "कुल ग्राहक",
  },
};

/**
 * Get translation for a key in the specified locale
 */
export function t(key: TranslationKey, locale: Locale = defaultLocale): string {
  return translations[locale]?.[key] || translations[defaultLocale][key] || key;
}

/**
 * Check if locale is RTL
 */
export function isRTL(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}

/**
 * Get browser's preferred locale
 */
export function getBrowserLocale(): Locale {
  if (typeof window === "undefined") return defaultLocale;
  const browserLang = navigator.language.split("-")[0] as Locale;
  return locales.includes(browserLang) ? browserLang : defaultLocale;
}

/**
 * Format number according to locale
 */
export function formatNumber(num: number, locale: Locale = defaultLocale): string {
  return new Intl.NumberFormat(locale).format(num);
}

/**
 * Format currency according to locale
 */
export function formatCurrency(
  amount: number,
  currency: string = "USD",
  locale: Locale = defaultLocale
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}

/**
 * Format date according to locale
 */
export function formatDate(
  date: Date | string,
  locale: Locale = defaultLocale,
  options?: Intl.DateTimeFormatOptions
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, options).format(d);
}
