import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// AIMarketOps theme context with default value
const AIMarketOpsThemeContext = createContext({
  mode: 'dark',
  toggleTheme: () => {},
  setTheme: () => {}
});

export const useAIMarketOpsTheme = () => {
  const context = useContext(AIMarketOpsThemeContext);
  if (!context) {
    // Return default theme instead of throwing error to prevent crashes
    console.warn('useAIMarketOpsTheme called outside of AIMarketOpsThemeProvider, using default theme');
    return {
      mode: 'dark',
      toggleTheme: () => {},
      setTheme: () => {}
    };
  }
  return context;
};

export const AIMarketOpsThemeProvider = ({ children }) => {
  // Initialize theme from localStorage or default to 'dark'
  const [mode, setMode] = useState('dark');
  const [isClient, setIsClient] = useState(false);

  // Handle client-side mounting
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('aimarketops-theme');
      if (savedMode && (savedMode === 'dark' || savedMode === 'light')) {
        setMode(savedMode);
      }
    }
  }, []);

  // Sync theme with localStorage on mount and changes
  useEffect(() => {
    if (isClient && typeof window !== 'undefined') {
      localStorage.setItem('aimarketops-theme', mode);
      console.log(`Theme changed to: ${mode}`);
    }
  }, [mode, isClient]);

  // Update document classes when mode changes
  useEffect(() => {
    if (isClient && typeof window !== 'undefined') {
      // Remove existing theme classes
      document.documentElement.classList.remove('theme-dark', 'theme-light');
      document.body.classList.remove('theme-dark', 'theme-light');
      
      // Add current theme class
      const themeClass = `theme-${mode}`;
      document.documentElement.classList.add(themeClass);
      document.body.classList.add(themeClass);
      
      // Also set data attributes for CSS selectors
      document.documentElement.setAttribute('data-mui-color-scheme', mode);
      document.documentElement.setAttribute('data-theme', mode);
      document.body.setAttribute('data-mui-color-scheme', mode);
      document.body.setAttribute('data-theme', mode);
      
      console.log(`Theme changed to: ${mode}`);
    }
  }, [mode, isClient]);

  // AIMarketOps-inspired themes
  const aimarketopsDarkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#4F8CFF', // AIMarketOps blue
        light: '#6BA1FF',
        dark: '#3A6BC7',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#10B981', // AIMarketOps green
        light: '#34D399',
        dark: '#059669',
        contrastText: '#FFFFFF',
      },
      error: {
        main: '#EF4444', // AIMarketOps red
        light: '#F87171',
        dark: '#DC2626',
      },
      warning: {
        main: '#F59E0B', // AIMarketOps yellow
        light: '#FBBF24',
        dark: '#D97706',
      },
      info: {
        main: '#4F8CFF',
        light: '#6BA1FF',
        dark: '#3A6BC7',
      },
      success: {
        main: '#10B981',
        light: '#34D399',
        dark: '#059669',
      },
      background: {
        default: '#1A1A1D', // AIMarketOps dark background
        paper: '#252528', // AIMarketOps card background
        secondary: '#2A2A2D',
        tertiary: '#3A3A3D',
      },
      text: {
        primary: '#E8E8EA', // High contrast text
        secondary: '#A1A1AA', // Secondary text
        disabled: '#71717A', // Muted text
      },
      divider: '#3A3A3D',
      action: {
        active: '#4F8CFF',
        hover: '#2A2A2D',
        selected: '#3A3A3D',
        disabled: '#71717A',
        disabledBackground: '#2A2A2D',
      },
    },
    typography: {
      fontFamily: '"Geist Sans", "Inter", "system-ui", "sans-serif"',
      h1: {
        fontSize: '2.5rem',
        fontWeight: 700,
        lineHeight: 1.2,
        letterSpacing: '-0.02em',
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 600,
        lineHeight: 1.3,
        letterSpacing: '-0.01em',
      },
      h3: {
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h4: {
        fontSize: '1.25rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h5: {
        fontSize: '1.125rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.5,
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      // Global body and root styling
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: '#1A1A1D',
            color: '#E8E8EA',
          },
          '*': {
            scrollbarWidth: 'thin',
            scrollbarColor: '#4F8CFF #2A2A2D',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#2A2A2D',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#4F8CFF',
              borderRadius: '4px',
            },
          },
        },
      },
      // Container global styling
      MuiContainer: {
        styleOverrides: {
          root: {
            backgroundColor: '#1A1A1D',
            color: '#E8E8EA',
          },
        },
      },
      // Paper components
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: '#252528',
            color: '#E8E8EA',
            borderColor: '#3A3A3D',
          },
        },
      },
      // Table components
      MuiTable: {
        styleOverrides: {
          root: {
            backgroundColor: '#252528',
            color: '#E8E8EA',
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor: '#2A2A2D',
            '& .MuiTableCell-head': {
              backgroundColor: '#2A2A2D',
              color: '#E8E8EA',
              fontWeight: 600,
            },
          },
        },
      },
      MuiTableBody: {
        styleOverrides: {
          root: {
            backgroundColor: '#252528',
            '& .MuiTableCell-body': {
              backgroundColor: '#252528',
              color: '#E8E8EA',
              borderBottomColor: '#3A3A3D',
            },
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            backgroundColor: '#252528',
            '&:hover': {
              backgroundColor: '#2A2A2D',
            },
            '&.Mui-selected': {
              backgroundColor: 'rgba(79, 140, 255, 0.1)',
            },
          },
        },
      },
      // List components for sidebar
      MuiList: {
        styleOverrides: {
          root: {
            backgroundColor: 'transparent',
            color: '#E8E8EA',
          },
        },
      },
      MuiListItem: {
        styleOverrides: {
          root: {
            color: '#E8E8EA',
            '&:hover': {
              backgroundColor: '#2A2A2D',
            },
          },
        },
      },
      MuiListItemText: {
        styleOverrides: {
          primary: {
            color: '#E8E8EA',
          },
          secondary: {
            color: '#A1A1AA',
          },
        },
      },
      // Drawer components
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: '#252528',
            color: '#E8E8EA',
            borderColor: '#3A3A3D',
          },
        },
      },
      // Typography components
      MuiTypography: {
        styleOverrides: {
          root: {
            color: '#E8E8EA',
          },
          h1: {
            color: '#E8E8EA',
          },
          h2: {
            color: '#E8E8EA',
          },
          h3: {
            color: '#E8E8EA',
          },
          h4: {
            color: '#E8E8EA',
          },
          h5: {
            color: '#E8E8EA',
          },
          h6: {
            color: '#E8E8EA',
          },
          body1: {
            color: '#E8E8EA',
          },
          body2: {
            color: '#E8E8EA',
          },
          caption: {
            color: '#A1A1AA',
          },
          colorTextSecondary: {
            color: '#A1A1AA',
          },
        },
      },
      // Input components
      MuiInputBase: {
        styleOverrides: {
          root: {
            color: '#E8E8EA',
            backgroundColor: '#2A2A2D',
            '& input': {
              color: '#E8E8EA',
            },
            '& textarea': {
              color: '#E8E8EA',
            },
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: '#A1A1AA',
            '&.Mui-focused': {
              color: '#4F8CFF',
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            color: '#E8E8EA',
            backgroundColor: '#2A2A2D',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#3A3A3D',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#4F8CFF',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#4F8CFF',
            },
          },
        },
      },
      // Select components
      MuiSelect: {
        styleOverrides: {
          root: {
            color: '#E8E8EA',
            backgroundColor: '#2A2A2D',
          },
          select: {
            color: '#E8E8EA',
            backgroundColor: '#2A2A2D',
          },
          icon: {
            color: '#A1A1AA',
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            color: '#E8E8EA',
            backgroundColor: '#252528',
            '&:hover': {
              backgroundColor: '#2A2A2D',
            },
            '&.Mui-selected': {
              backgroundColor: 'rgba(79, 140, 255, 0.15)',
              '&:hover': {
                backgroundColor: 'rgba(79, 140, 255, 0.25)',
              },
            },
          },
        },
      },
      // Menu components
      MuiMenu: {
        styleOverrides: {
          paper: {
            backgroundColor: '#252528',
            color: '#E8E8EA',
            border: '1px solid #3A3A3D',
          },
          list: {
            backgroundColor: '#252528',
            color: '#E8E8EA',
          },
        },
      },
      // FormControl components
      MuiFormControl: {
        styleOverrides: {
          root: {
            '& .MuiInputLabel-root': {
              color: '#A1A1AA',
              '&.Mui-focused': {
                color: '#4F8CFF',
              },
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: '#252528',
            color: '#E8E8EA',
            border: '1px solid',
            borderColor: '#3A3A3D',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
            },
          },
        },
      },
      // CardContent components
      MuiCardContent: {
        styleOverrides: {
          root: {
            backgroundColor: 'inherit',
            color: '#E8E8EA',
            '& .MuiTypography-root': {
              color: '#E8E8EA',
            },
            '& .MuiTypography-colorTextSecondary': {
              color: '#A1A1AA',
            },
          },
        },
      },
      // Ensure all components use dark background
      MuiBox: {
        styleOverrides: {
          root: {
            backgroundColor: 'inherit',
            color: 'inherit',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(79, 140, 255, 0.3)',
            },
          },
          text: {
            color: '#E8E8EA',
            '&:hover': {
              backgroundColor: 'rgba(79, 140, 255, 0.1)',
            },
          },
          contained: {
            color: '#FFFFFF',
            backgroundColor: '#4F8CFF',
            '&:hover': {
              backgroundColor: '#3A6BC7',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              backgroundColor: '#2A2A2D',
              color: '#E8E8EA',
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#4F8CFF',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#4F8CFF',
                borderWidth: '2px',
              },
            },
            '& .MuiInputLabel-root': {
              color: '#A1A1AA',
              '&.Mui-focused': {
                color: '#4F8CFF',
              },
            },
            '& input': {
              color: '#E8E8EA',
            },
            '& textarea': {
              color: '#E8E8EA',
            },
          },
        },
      },
      // Chip components
      MuiChip: {
        styleOverrides: {
          root: {
            color: '#E8E8EA',
            backgroundColor: '#3A3A3D',
            '&.MuiChip-colorPrimary': {
              backgroundColor: '#4F8CFF',
              color: '#FFFFFF',
            },
            '&.MuiChip-colorSecondary': {
              backgroundColor: '#10B981',
              color: '#FFFFFF',
            },
            '&.MuiChip-colorSuccess': {
              backgroundColor: '#10B981',
              color: '#FFFFFF',
            },
            '&.MuiChip-colorError': {
              backgroundColor: '#EF4444',
              color: '#FFFFFF',
            },
            '&.MuiChip-colorWarning': {
              backgroundColor: '#F59E0B',
              color: '#FFFFFF',
            },
            '&.MuiChip-colorInfo': {
              backgroundColor: '#4F8CFF',
              color: '#FFFFFF',
            },
          },
          outlined: {
            borderColor: '#3A3A3D',
            color: '#E8E8EA',
            backgroundColor: 'transparent',
            '&.MuiChip-colorPrimary': {
              borderColor: '#4F8CFF',
              color: '#4F8CFF',
            },
            '&.MuiChip-colorSecondary': {
              borderColor: '#10B981',
              color: '#10B981',
            },
            '&.MuiChip-colorSuccess': {
              borderColor: '#10B981',
              color: '#10B981',
            },
            '&.MuiChip-colorError': {
              borderColor: '#EF4444',
              color: '#EF4444',
            },
            '&.MuiChip-colorWarning': {
              borderColor: '#F59E0B',
              color: '#F59E0B',
            },
            '&.MuiChip-colorInfo': {
              borderColor: '#4F8CFF',
              color: '#4F8CFF',
            },
          },
        },
      },
      // Dialog components
      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundColor: '#252528',
            color: '#E8E8EA',
            border: '1px solid #3A3A3D',
          },
        },
      },
      MuiDialogTitle: {
        styleOverrides: {
          root: {
            backgroundColor: '#252528',
            color: '#E8E8EA',
            borderBottom: '1px solid #3A3A3D',
          },
        },
      },
      MuiDialogContent: {
        styleOverrides: {
          root: {
            backgroundColor: '#252528',
            color: '#E8E8EA',
          },
        },
      },
      MuiDialogActions: {
        styleOverrides: {
          root: {
            backgroundColor: '#252528',
            borderTop: '1px solid #3A3A3D',
          },
        },
      },
      // Backdrop component
      MuiBackdrop: {
        styleOverrides: {
          root: {
            backgroundColor: 'rgba(26, 26, 29, 0.8)',
          },
        },
      },
    },
  });

  const aimarketopsLightTheme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#4F8CFF', // AIMarketOps blue
        light: '#6BA1FF',
        dark: '#3A6BC7',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#10B981', // AIMarketOps green
        light: '#34D399',
        dark: '#059669',
        contrastText: '#FFFFFF',
      },
      error: {
        main: '#EF4444', // AIMarketOps red
        light: '#F87171',
        dark: '#DC2626',
      },
      warning: {
        main: '#F59E0B', // AIMarketOps yellow
        light: '#FBBF24',
        dark: '#D97706',
      },
      info: {
        main: '#4F8CFF',
        light: '#6BA1FF',
        dark: '#3A6BC7',
      },
      success: {
        main: '#10B981',
        light: '#34D399',
        dark: '#059669',
      },
      background: {
        default: '#FFFFFF', // Light background
        paper: '#F8F9FA', // Light card background
        secondary: '#F1F3F4',
        tertiary: '#E8EAED',
      },
      text: {
        primary: '#1A1A1D', // Dark text for light mode
        secondary: '#5F6368', // Secondary text
        disabled: '#9AA0A6', // Muted text
      },
      divider: '#E8EAED',
      action: {
        active: '#4F8CFF',
        hover: '#F1F3F4',
        selected: '#E8EAED',
        disabled: '#9AA0A6',
        disabledBackground: '#F1F3F4',
      },
    },
    typography: {
      fontFamily: '"Geist Sans", "Inter", "system-ui", "sans-serif"',
      h1: {
        fontSize: '2.5rem',
        fontWeight: 700,
        lineHeight: 1.2,
        letterSpacing: '-0.02em',
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 600,
        lineHeight: 1.3,
        letterSpacing: '-0.01em',
      },
      h3: {
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h4: {
        fontSize: '1.25rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h5: {
        fontSize: '1.125rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.5,
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            background: 'linear-gradient(135deg, #F8F9FA 0%, #FFFFFF 100%)',
            border: '1px solid #E8EAED',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(79, 140, 255, 0.3)',
            },
          },
        },
      },

      // Paper components for light theme
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: '#FFFFFF',
            color: '#1A1A1D',
            borderColor: '#E8EAED',
          },
        },
      },
      // Container components for light theme
      MuiContainer: {
        styleOverrides: {
          root: {
            backgroundColor: '#FFFFFF',
            color: '#1A1A1D',
          },
        },
      },
      // Table components for light theme
      MuiTable: {
        styleOverrides: {
          root: {
            backgroundColor: '#FFFFFF',
            color: '#1A1A1D',
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor: '#F1F3F4',
            '& .MuiTableCell-head': {
              backgroundColor: '#F1F3F4',
              color: '#1A1A1D',
              fontWeight: 600,
            },
          },
        },
      },
      MuiTableBody: {
        styleOverrides: {
          root: {
            backgroundColor: '#FFFFFF',
            '& .MuiTableCell-body': {
              backgroundColor: '#FFFFFF',
              color: '#1A1A1D',
              borderBottomColor: '#E8EAED',
            },
          },
        },
      },
      // Typography for light theme
      MuiTypography: {
        styleOverrides: {
          root: {
            color: '#1A1A1D',
          },
          colorTextSecondary: {
            color: '#5F6368',
          },
        },
      },

      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            backgroundColor: '#FFFFFF',
            color: '#1A1A1D',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#E8EAED',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#4F8CFF',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#4F8CFF',
            },
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            backgroundColor: '#FFFFFF',
            color: '#1A1A1D',
          },
          input: {
            color: '#1A1A1D',
            '&::placeholder': {
              color: '#9AA0A6',
              opacity: 1,
            },
          },
        },
      },
      MuiFormControl: {
        styleOverrides: {
          root: {
            backgroundColor: '#FFFFFF',
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#FFFFFF',
              color: '#1A1A1D',
            },
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            backgroundColor: '#FFFFFF',
            color: '#1A1A1D',
          },
          select: {
            backgroundColor: '#FFFFFF',
            color: '#1A1A1D',
          },
        },
      },
      MuiPopover: {
        styleOverrides: {
          paper: {
            backgroundColor: '#FFFFFF',
            color: '#1A1A1D',
            border: '1px solid #E8EAED',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            backgroundColor: '#FFFFFF',
            color: '#1A1A1D',
            border: '1px solid #E8EAED',
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            backgroundColor: '#FFFFFF',
            color: '#1A1A1D',
            '&:hover': {
              backgroundColor: '#F1F3F4',
            },
            '&.Mui-selected': {
              backgroundColor: '#E8EAED',
              '&:hover': {
                backgroundColor: '#E8EAED',
              },
            },
          },
        },
      },
      // Chip components for light theme
      MuiChip: {
        styleOverrides: {
          root: {
            color: '#1A1A1D',
            backgroundColor: '#F1F3F4',
            '&.MuiChip-colorPrimary': {
              backgroundColor: '#4F8CFF',
              color: '#FFFFFF',
            },
            '&.MuiChip-colorSecondary': {
              backgroundColor: '#10B981',
              color: '#FFFFFF',
            },
            '&.MuiChip-colorSuccess': {
              backgroundColor: '#10B981',
              color: '#FFFFFF',
            },
            '&.MuiChip-colorError': {
              backgroundColor: '#EF4444',
              color: '#FFFFFF',
            },
            '&.MuiChip-colorWarning': {
              backgroundColor: '#F59E0B',
              color: '#FFFFFF',
            },
            '&.MuiChip-colorInfo': {
              backgroundColor: '#4F8CFF',
              color: '#FFFFFF',
            },
          },
        },
      },
    },
  });

  const toggleMode = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('aimarketops-theme', newMode);
      }
      return newMode;
    });
  };

  const setModeDirectly = (newMode) => {
    setMode(newMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('aimarketops-theme', newMode);
    }
  };

  const value = {
    mode,
    toggleMode,
    setMode: setModeDirectly,
    getStoredTheme: () => {
      if (typeof window !== 'undefined') {
        return localStorage.getItem('aimarketops-theme') || 'dark';
      }
      return 'dark';
    },
  };

  return (
    <AIMarketOpsThemeContext.Provider value={value}>
      <MuiThemeProvider theme={mode === 'dark' ? aimarketopsDarkTheme : aimarketopsLightTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </AIMarketOpsThemeContext.Provider>
  );
}; 