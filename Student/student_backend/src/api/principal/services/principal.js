'use strict';

/**
 * principal service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::principal.principal');
