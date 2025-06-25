'use strict';

/**
 * principal controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::principal.principal');
