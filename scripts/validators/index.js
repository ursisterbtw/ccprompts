/**
 * Validators module index
 * Exports all validation modules for easy importing
 */

module.exports = {
  MainValidator: require('./main-validator'),
  SecurityValidator: require('./security-validator'),
  StructureValidator: require('./structure-validator'),
  QualityScorer: require('./quality-scorer'),
  FileUtils: require('./file-utils')
};