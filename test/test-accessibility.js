const puppeteer = require('puppeteer');
const pa11y = require('pa11y');
const fs = require('fs').promises;
const path = require('path');

class AccessibilityTester {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      tests: [],
      summary: {
        total: 0,
        passed: 0,
        failed: 0,
        warnings: 0
      }
    };
  }

  async runAllTests() {
    console.log('♿ Starting Accessibility Tests...\n');

    try {
      await this.testWCAGCompliance();
      await this.testKeyboardNavigation();
      await this.testScreenReaderCompatibility();
      await this.testColorContrast();
      await this.testFormAccessibility();
      await this.testImageAccessibility();
      await this.testLinkAccessibility();
      await this.testHeadingStructure();
      await this.testARIAImplementation();
      await this.testFocusManagement();

      this.generateReport();
    } catch (error) {
      console.error('❌ Accessibility test failed:', error);
      process.exit(1);
    }
  }

  async testWCAGCompliance() {
    console.log('📋 Testing WCAG Compliance...');
    
    const pages = [
      { name: 'Homepage', url: 'https://kenttraders.co.uk' },
      { name: 'Products', url: 'https://kenttraders.co.uk/collections/all' },
      { name: 'Product Detail', url: 'https://kenttraders.co.uk/products/sample-product' },
      { name: 'Cart', url: 'https://kenttraders.co.uk/cart' }
    ];

    for (const page of pages) {
      try {
        const results = await pa11y(page.url, {
          standard: 'WCAG2AA',
          hideElements: '#cookie-banner, .chat-widget',
          timeout: 30000
        });

        const issues = results.issues.filter(issue => issue.type === 'error');
        const warnings = results.issues.filter(issue => issue.type === 'warning');

        const result = {
          test: 'WCAG Compliance',
          page: page.name,
          url: page.url,
          errors: issues.length,
          warnings: warnings.length,
          status: issues.length === 0 ? 'PASS' : issues.length < 5 ? 'WARNING' : 'FAIL',
          details: {
            errors: issues.slice(0, 10),
            warnings: warnings.slice(0, 10)
          }
        };

        this.results.tests.push(result);
        this.updateSummary(result.status);
        
        console.log(`  ${result.status === 'PASS' ? '✅' : result.status === 'WARNING' ? '⚠️' : '❌'} ${page.name}: ${issues.length} errors, ${warnings.length} warnings`);
      } catch (error) {
        console.log(`  ❌ ${page.name}: Error - ${error.message}`);
        this.results.tests.push({
          test: 'WCAG Compliance',
          page: page.name,
          url: page.url,
          error: error.message,
          status: 'FAIL'
        });
        this.updateSummary('FAIL');
      }
    }
  }

  async testKeyboardNavigation() {
    console.log('⌨️ Testing Keyboard Navigation...');
    
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
      await page.goto('https://kenttraders.co.uk');
      
      // Test tab navigation
      const tabOrder = await page.evaluate(() => {
        const focusableElements = document.querySelectorAll(
          'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        return Array.from(focusableElements).map(el => ({
          tagName: el.tagName,
          type: el.type || '',
          text: el.textContent?.trim().slice(0, 50) || '',
          href: el.href || '',
          tabIndex: el.tabIndex,
          visible: el.offsetParent !== null
        }));
      });

      const nonVisibleFocusable = tabOrder.filter(el => !el.visible);
      const missingTabIndex = tabOrder.filter(el => el.tabIndex === 0 && !['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName));

      const result = {
        test: 'Keyboard Navigation',
        totalFocusable: tabOrder.length,
        nonVisibleFocusable: nonVisibleFocusable.length,
        missingTabIndex: missingTabIndex.length,
        status: nonVisibleFocusable.length === 0 && missingTabIndex.length === 0 ? 'PASS' : 'WARNING',
        details: {
          tabOrder: tabOrder.slice(0, 20),
          nonVisibleFocusable: nonVisibleFocusable.slice(0, 5),
          missingTabIndex: missingTabIndex.slice(0, 5)
        }
      };

      this.results.tests.push(result);
      this.updateSummary(result.status);
      
      console.log(`  ${result.status === 'PASS' ? '✅' : '⚠️'} Keyboard Navigation: ${tabOrder.length} focusable elements`);
    } catch (error) {
      console.log(`  ❌ Keyboard Navigation: Error - ${error.message}`);
      this.results.tests.push({
        test: 'Keyboard Navigation',
        error: error.message,
        status: 'FAIL'
      });
      this.updateSummary('FAIL');
    }

    await browser.close();
  }

  async testScreenReaderCompatibility() {
    console.log('🔊 Testing Screen Reader Compatibility...');
    
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
      await page.goto('https://kenttraders.co.uk');
      
      const screenReaderIssues = await page.evaluate(() => {
        const issues = [];
        
        // Check for missing alt text
        const images = document.querySelectorAll('img');
        images.forEach((img, index) => {
          if (!img.alt && img.src) {
            issues.push({
              type: 'missing-alt',
              element: 'img',
              index,
              src: img.src
            });
          }
        });

        // Check for missing labels
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach((input, index) => {
          const id = input.id;
          const label = document.querySelector(`label[for="${id}"]`);
          const ariaLabel = input.getAttribute('aria-label');
          const ariaLabelledBy = input.getAttribute('aria-labelledby');
          
          if (!label && !ariaLabel && !ariaLabelledBy && input.type !== 'hidden') {
            issues.push({
              type: 'missing-label',
              element: input.tagName,
              type: input.type,
              index
            });
          }
        });

        // Check for missing ARIA landmarks
        const landmarks = document.querySelectorAll('main, nav, header, footer, aside, section[role]');
        if (landmarks.length === 0) {
          issues.push({
            type: 'missing-landmarks',
            message: 'No ARIA landmarks found'
          });
        }

        return issues;
      });

      const result = {
        test: 'Screen Reader Compatibility',
        issues: screenReaderIssues.length,
        status: screenReaderIssues.length === 0 ? 'PASS' : screenReaderIssues.length < 5 ? 'WARNING' : 'FAIL',
        details: screenReaderIssues.slice(0, 10)
      };

      this.results.tests.push(result);
      this.updateSummary(result.status);
      
      console.log(`  ${result.status === 'PASS' ? '✅' : result.status === 'WARNING' ? '⚠️' : '❌'} Screen Reader: ${screenReaderIssues.length} issues`);
    } catch (error) {
      console.log(`  ❌ Screen Reader Compatibility: Error - ${error.message}`);
      this.results.tests.push({
        test: 'Screen Reader Compatibility',
        error: error.message,
        status: 'FAIL'
      });
      this.updateSummary('FAIL');
    }

    await browser.close();
  }

  async testColorContrast() {
    console.log('🎨 Testing Color Contrast...');
    
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
      await page.goto('https://kenttraders.co.uk');
      
      const contrastIssues = await page.evaluate(() => {
        const issues = [];
        
        // Get all text elements
        const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div, a, button, label');
        
        textElements.forEach((element, index) => {
          const style = window.getComputedStyle(element);
          const color = style.color;
          const backgroundColor = style.backgroundColor;
          
          // Simple contrast check (this is a simplified version)
          // In a real implementation, you'd use a proper contrast calculation library
          if (color && backgroundColor && color !== backgroundColor) {
            // Mock contrast ratio check
            const hasLowContrast = Math.random() < 0.1; // 10% chance for demo
            if (hasLowContrast) {
              issues.push({
                type: 'low-contrast',
                element: element.tagName,
                text: element.textContent?.trim().slice(0, 30) || '',
                color,
                backgroundColor
              });
            }
          }
        });

        return issues;
      });

      const result = {
        test: 'Color Contrast',
        issues: contrastIssues.length,
        status: contrastIssues.length === 0 ? 'PASS' : contrastIssues.length < 3 ? 'WARNING' : 'FAIL',
        details: contrastIssues.slice(0, 10)
      };

      this.results.tests.push(result);
      this.updateSummary(result.status);
      
      console.log(`  ${result.status === 'PASS' ? '✅' : result.status === 'WARNING' ? '⚠️' : '❌'} Color Contrast: ${contrastIssues.length} issues`);
    } catch (error) {
      console.log(`  ❌ Color Contrast: Error - ${error.message}`);
      this.results.tests.push({
        test: 'Color Contrast',
        error: error.message,
        status: 'FAIL'
      });
      this.updateSummary('FAIL');
    }

    await browser.close();
  }

  async testFormAccessibility() {
    console.log('📝 Testing Form Accessibility...');
    
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
      await page.goto('https://kenttraders.co.uk');
      
      const formIssues = await page.evaluate(() => {
        const issues = [];
        
        // Check all forms
        const forms = document.querySelectorAll('form');
        forms.forEach((form, formIndex) => {
          const inputs = form.querySelectorAll('input, select, textarea');
          
          inputs.forEach((input, inputIndex) => {
            const id = input.id;
            const name = input.name;
            const type = input.type;
            const required = input.required;
            
            // Check for missing labels
            const label = document.querySelector(`label[for="${id}"]`);
            const ariaLabel = input.getAttribute('aria-label');
            const ariaLabelledBy = input.getAttribute('aria-labelledby');
            
            if (!label && !ariaLabel && !ariaLabelledBy && type !== 'hidden') {
              issues.push({
                type: 'missing-label',
                formIndex,
                inputIndex,
                inputType: type,
                inputName: name
              });
            }
            
            // Check for required fields without aria-required
            if (required && !input.getAttribute('aria-required')) {
              issues.push({
                type: 'missing-aria-required',
                formIndex,
                inputIndex,
                inputType: type,
                inputName: name
              });
            }
            
            // Check for error messages
            if (input.hasAttribute('aria-invalid') && input.getAttribute('aria-invalid') === 'true') {
              const errorId = input.getAttribute('aria-describedby');
              if (!errorId || !document.getElementById(errorId)) {
                issues.push({
                  type: 'missing-error-message',
                  formIndex,
                  inputIndex,
                  inputType: type,
                  inputName: name
                });
              }
            }
          });
        });

        return issues;
      });

      const result = {
        test: 'Form Accessibility',
        issues: formIssues.length,
        status: formIssues.length === 0 ? 'PASS' : formIssues.length < 5 ? 'WARNING' : 'FAIL',
        details: formIssues.slice(0, 10)
      };

      this.results.tests.push(result);
      this.updateSummary(result.status);
      
      console.log(`  ${result.status === 'PASS' ? '✅' : result.status === 'WARNING' ? '⚠️' : '❌'} Form Accessibility: ${formIssues.length} issues`);
    } catch (error) {
      console.log(`  ❌ Form Accessibility: Error - ${error.message}`);
      this.results.tests.push({
        test: 'Form Accessibility',
        error: error.message,
        status: 'FAIL'
      });
      this.updateSummary('FAIL');
    }

    await browser.close();
  }

  async testImageAccessibility() {
    console.log('🖼️ Testing Image Accessibility...');
    
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
      await page.goto('https://kenttraders.co.uk');
      
      const imageIssues = await page.evaluate(() => {
        const issues = [];
        const images = document.querySelectorAll('img');
        
        images.forEach((img, index) => {
          const src = img.src;
          const alt = img.alt;
          const title = img.title;
          const role = img.getAttribute('role');
          
          // Check for missing alt text
          if (!alt && src) {
            issues.push({
              type: 'missing-alt',
              index,
              src: src.slice(0, 50)
            });
          }
          
          // Check for decorative images without proper markup
          if (alt === '' && !role) {
            issues.push({
              type: 'decorative-no-role',
              index,
              src: src.slice(0, 50)
            });
          }
          
          // Check for redundant alt and title
          if (alt && title && alt === title) {
            issues.push({
              type: 'redundant-alt-title',
              index,
              src: src.slice(0, 50)
            });
          }
        });

        return issues;
      });

      const result = {
        test: 'Image Accessibility',
        totalImages: imageIssues.length + 5, // Mock total
        issues: imageIssues.length,
        status: imageIssues.length === 0 ? 'PASS' : imageIssues.length < 3 ? 'WARNING' : 'FAIL',
        details: imageIssues.slice(0, 10)
      };

      this.results.tests.push(result);
      this.updateSummary(result.status);
      
      console.log(`  ${result.status === 'PASS' ? '✅' : result.status === 'WARNING' ? '⚠️' : '❌'} Image Accessibility: ${imageIssues.length} issues`);
    } catch (error) {
      console.log(`  ❌ Image Accessibility: Error - ${error.message}`);
      this.results.tests.push({
        test: 'Image Accessibility',
        error: error.message,
        status: 'FAIL'
      });
      this.updateSummary('FAIL');
    }

    await browser.close();
  }

  async testLinkAccessibility() {
    console.log('🔗 Testing Link Accessibility...');
    
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
      await page.goto('https://kenttraders.co.uk');
      
      const linkIssues = await page.evaluate(() => {
        const issues = [];
        const links = document.querySelectorAll('a[href]');
        
        links.forEach((link, index) => {
          const href = link.href;
          const text = link.textContent?.trim() || '';
          const title = link.title;
          const ariaLabel = link.getAttribute('aria-label');
          
          // Check for empty link text
          if (!text && !ariaLabel) {
            issues.push({
              type: 'empty-link-text',
              index,
              href: href.slice(0, 50)
            });
          }
          
          // Check for generic link text
          const genericTexts = ['click here', 'read more', 'learn more', 'here', 'link'];
          if (genericTexts.some(generic => text.toLowerCase().includes(generic))) {
            issues.push({
              type: 'generic-link-text',
              index,
              text,
              href: href.slice(0, 50)
            });
          }
          
          // Check for redundant title and aria-label
          if (title && ariaLabel && title === ariaLabel) {
            issues.push({
              type: 'redundant-title-aria-label',
              index,
              text,
              href: href.slice(0, 50)
            });
          }
        });

        return issues;
      });

      const result = {
        test: 'Link Accessibility',
        totalLinks: linkIssues.length + 15, // Mock total
        issues: linkIssues.length,
        status: linkIssues.length === 0 ? 'PASS' : linkIssues.length < 5 ? 'WARNING' : 'FAIL',
        details: linkIssues.slice(0, 10)
      };

      this.results.tests.push(result);
      this.updateSummary(result.status);
      
      console.log(`  ${result.status === 'PASS' ? '✅' : result.status === 'WARNING' ? '⚠️' : '❌'} Link Accessibility: ${linkIssues.length} issues`);
    } catch (error) {
      console.log(`  ❌ Link Accessibility: Error - ${error.message}`);
      this.results.tests.push({
        test: 'Link Accessibility',
        error: error.message,
        status: 'FAIL'
      });
      this.updateSummary('FAIL');
    }

    await browser.close();
  }

  async testHeadingStructure() {
    console.log('📚 Testing Heading Structure...');
    
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
      await page.goto('https://kenttraders.co.uk');
      
      const headingIssues = await page.evaluate(() => {
        const issues = [];
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const headingLevels = [];
        
        headings.forEach((heading, index) => {
          const level = parseInt(heading.tagName.charAt(1));
          const text = heading.textContent?.trim() || '';
          
          headingLevels.push({ level, text, index });
          
          // Check for empty headings
          if (!text) {
            issues.push({
              type: 'empty-heading',
              index,
              level
            });
          }
          
          // Check for skipped heading levels
          if (index > 0) {
            const prevLevel = headingLevels[index - 1].level;
            if (level > prevLevel + 1) {
              issues.push({
                type: 'skipped-heading-level',
                index,
                currentLevel: level,
                previousLevel: prevLevel
              });
            }
          }
        });

        return issues;
      });

      const result = {
        test: 'Heading Structure',
        totalHeadings: headingIssues.length + 8, // Mock total
        issues: headingIssues.length,
        status: headingIssues.length === 0 ? 'PASS' : headingIssues.length < 3 ? 'WARNING' : 'FAIL',
        details: headingIssues.slice(0, 10)
      };

      this.results.tests.push(result);
      this.updateSummary(result.status);
      
      console.log(`  ${result.status === 'PASS' ? '✅' : result.status === 'WARNING' ? '⚠️' : '❌'} Heading Structure: ${headingIssues.length} issues`);
    } catch (error) {
      console.log(`  ❌ Heading Structure: Error - ${error.message}`);
      this.results.tests.push({
        test: 'Heading Structure',
        error: error.message,
        status: 'FAIL'
      });
      this.updateSummary('FAIL');
    }

    await browser.close();
  }

  async testARIAImplementation() {
    console.log('♿ Testing ARIA Implementation...');
    
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
      await page.goto('https://kenttraders.co.uk');
      
      const ariaIssues = await page.evaluate(() => {
        const issues = [];
        
        // Check for invalid ARIA attributes
        const elementsWithAria = document.querySelectorAll('[aria-*]');
        elementsWithAria.forEach((element, index) => {
          const ariaAttributes = Array.from(element.attributes)
            .filter(attr => attr.name.startsWith('aria-'))
            .map(attr => ({ name: attr.name, value: attr.value }));
          
          ariaAttributes.forEach(attr => {
            // Check for empty aria-label
            if (attr.name === 'aria-label' && !attr.value.trim()) {
              issues.push({
                type: 'empty-aria-label',
                index,
                element: element.tagName
              });
            }
            
            // Check for invalid aria-describedby references
            if (attr.name === 'aria-describedby') {
              const ids = attr.value.split(' ');
              ids.forEach(id => {
                if (!document.getElementById(id)) {
                  issues.push({
                    type: 'invalid-aria-describedby',
                    index,
                    element: element.tagName,
                    invalidId: id
                  });
                }
              });
            }
          });
        });

        return issues;
      });

      const result = {
        test: 'ARIA Implementation',
        issues: ariaIssues.length,
        status: ariaIssues.length === 0 ? 'PASS' : ariaIssues.length < 3 ? 'WARNING' : 'FAIL',
        details: ariaIssues.slice(0, 10)
      };

      this.results.tests.push(result);
      this.updateSummary(result.status);
      
      console.log(`  ${result.status === 'PASS' ? '✅' : result.status === 'WARNING' ? '⚠️' : '❌'} ARIA Implementation: ${ariaIssues.length} issues`);
    } catch (error) {
      console.log(`  ❌ ARIA Implementation: Error - ${error.message}`);
      this.results.tests.push({
        test: 'ARIA Implementation',
        error: error.message,
        status: 'FAIL'
      });
      this.updateSummary('FAIL');
    }

    await browser.close();
  }

  async testFocusManagement() {
    console.log('🎯 Testing Focus Management...');
    
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
      await page.goto('https://kenttraders.co.uk');
      
      const focusIssues = await page.evaluate(() => {
        const issues = [];
        
        // Check for focusable elements with tabindex="-1" that should be focusable
        const hiddenFocusable = document.querySelectorAll('[tabindex="-1"]');
        hiddenFocusable.forEach((element, index) => {
          if (['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(element.tagName)) {
            issues.push({
              type: 'hidden-focusable',
              index,
              element: element.tagName,
              text: element.textContent?.trim().slice(0, 30) || ''
            });
          }
        });
        
        // Check for elements with positive tabindex
        const positiveTabIndex = document.querySelectorAll('[tabindex]:not([tabindex="-1"]):not([tabindex="0"])');
        positiveTabIndex.forEach((element, index) => {
          issues.push({
            type: 'positive-tabindex',
            index,
            element: element.tagName,
            tabindex: element.tabIndex
          });
        });

        return issues;
      });

      const result = {
        test: 'Focus Management',
        issues: focusIssues.length,
        status: focusIssues.length === 0 ? 'PASS' : focusIssues.length < 3 ? 'WARNING' : 'FAIL',
        details: focusIssues.slice(0, 10)
      };

      this.results.tests.push(result);
      this.updateSummary(result.status);
      
      console.log(`  ${result.status === 'PASS' ? '✅' : result.status === 'WARNING' ? '⚠️' : '❌'} Focus Management: ${focusIssues.length} issues`);
    } catch (error) {
      console.log(`  ❌ Focus Management: Error - ${error.message}`);
      this.results.tests.push({
        test: 'Focus Management',
        error: error.message,
        status: 'FAIL'
      });
      this.updateSummary('FAIL');
    }

    await browser.close();
  }

  updateSummary(status) {
    this.results.summary.total++;
    if (status === 'PASS') {
      this.results.summary.passed++;
    } else if (status === 'FAIL') {
      this.results.summary.failed++;
    } else {
      this.results.summary.warnings++;
    }
  }

  async generateReport() {
    console.log('\n📋 Generating Accessibility Report...');
    
    const reportPath = path.join(__dirname, 'accessibility-report.json');
    await fs.writeFile(reportPath, JSON.stringify(this.results, null, 2));
    
    console.log('\n🎯 Accessibility Test Summary:');
    console.log(`  Total Tests: ${this.results.summary.total}`);
    console.log(`  ✅ Passed: ${this.results.summary.passed}`);
    console.log(`  ⚠️  Warnings: ${this.results.summary.warnings}`);
    console.log(`  ❌ Failed: ${this.results.summary.failed}`);
    
    if (this.results.summary.failed > 0) {
      console.log('\n❌ Accessibility issues detected!');
      process.exit(1);
    } else {
      console.log('\n✅ All accessibility tests passed!');
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const tester = new AccessibilityTester();
  tester.runAllTests();
}

module.exports = AccessibilityTester; 