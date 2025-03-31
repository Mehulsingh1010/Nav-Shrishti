/* eslint-disable @typescript-eslint/no-explicit-any */
// Add Google Translate types
interface Window {
    googleTranslateElementInit: () => void
    google: {
      translate: {
        TranslateElement: {
          new (options: any, element: string): any
          InlineLayout: {
            SIMPLE: string
            HORIZONTAL: string
            VERTICAL: string
          }
        }
      }
    }
  }
  
  