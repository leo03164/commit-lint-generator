import { headerMaxLength, headerCase, headerFullStop, headerMinLength, headerTrim } from './header.js';
import { bodyFullStop, bodyEmpty, bodyCase, bodyMaxLength, bodyMaxLineLength, bodyMinLength, bodyLeadingBlank } from './body.js';
import { footerEmpty, footerMaxLineLength, footerMaxLength, footerMinLength } from './footer.js';
import { typeEnum, typeCase } from './type.js'

export const ruleMap = {
  'header-max-length': headerMaxLength,
  'body-full-stop': bodyFullStop,
  'body-empty': bodyEmpty,
  'footer-empty': footerEmpty,
  'type-enum': typeEnum,
  'type-case': typeCase,
  'header-case': headerCase,
  'body-case': bodyCase,
  'header-full-stop': headerFullStop,
  'header-min-length': headerMinLength,
  'header-trim': headerTrim,
  'body-max-line-length': bodyMaxLineLength,
  'footer-max-line-length': footerMaxLineLength,
  'body-max-length': bodyMaxLength,
  'footer-max-length': footerMaxLength,
  'body-min-length': bodyMinLength,
  'footer-min-length': footerMinLength,
  'body-leading-blank': bodyLeadingBlank,
}