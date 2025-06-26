import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('http://192.168.1.97:5173/');
    page.pause();

    // await page.waitForSelector('canvas', { timeout: 10000 });
    // Expect a title "to contain" a substring.

    // await page.waitForFunction(
    //     () => {
    //         const canvas = document.querySelector('canvas');
    //         return (
    //             canvas &&
    //             canvas.getContext('webgl') &&
    //             canvas.width > 0 &&
    //             canvas.height > 0
    //         );
    //     },
    //     { timeout: 15000 }
    // );

    console.log('✅ Canvas ready');

    // await page.waitForTimeout(5000);
    // await page.waitForTimeout(3000);

    const canvas = page.locator('#canva div').nth(2);
    await expect(canvas).toBeVisible();
    await expect(canvas).toBeAttached();
    // Scroll vers le bas
    await canvas.hover();
    console.log('✅ Hovering canvas');
    // await canvas.dispatchEvent('wheel', {
    //     deltaY: 50, // ✅ 10x plus puissant !
    //     deltaX: 0,
    //     deltaZ: 0,
    //     bubbles: true,
    //     cancelable: true,
    //     clientX: 640,
    //     clientY: 400,
    // });
    // for (let i = 0; i < 3; i++) {
    //     await canvas.dispatchEvent('wheel', {
    //         deltaY: 50, // ✅ 10x plus puissant !
    //         deltaX: 0,
    //         deltaZ: 0,
    //         bubbles: true,
    //         cancelable: true,
    //         clientX: 640,
    //         clientY: 400,
    //     });

    //     console.log(`Powerful scroll ${i + 1}/3 (deltaY: 1000)`);
    //     await page.waitForTimeout(500);

    //     // Vérifier si navigation a eu lieu
    //     const currentUrl = page.url();
    //     if (currentUrl.includes('a-propos')) {
    //         console.log('✅ Navigation triggered early!');
    //         break;
    //     }
    // }
    // await page.evaluate(() => {
    //     window.scrollTo(0, document.body.scrollHeight);
    // });

    // Utilisateur continue à scroller
    // await page.mouse.wheel(0, document.body.scrollHeight);
    await page.mouse.wheel(0, 1000);
    await page.waitForTimeout(1000);
    await page.mouse.wheel(0, 1000);
    await page.waitForTimeout(1000);
    await page.mouse.wheel(0, 1000);
    // await page.mouse.wheel(0, 100);
    // Navigation se déclenche vraiment
    await expect(page).toHaveURL('http://192.168.1.97:5173/a-propos');
});

test('get started link', async ({ page }) => {
    await page.goto('https://playwright.dev/');

    // Click the get started link.
    await page.getByRole('link', { name: 'Get started' }).click();

    // Expects page to have a heading with the name of Installation.
    await expect(
        page.getByRole('heading', { name: 'Installation' })
    ).toBeVisible();
});
