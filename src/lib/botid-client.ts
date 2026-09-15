import { initBotId } from 'botid/client/core';

// Match the forms' fetch URLs, including direct requests without trailing slashes.
initBotId({
  protect: ['/api/contact', '/api/contact/', '/api/lab-access', '/api/lab-access/'].map(path => ({
    path, method: 'POST', advancedOptions: { checkLevel: 'basic' },
  })),
});
