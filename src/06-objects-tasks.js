/* eslint-disable linebreak-style */
/* ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea() {
      return this.width * this.height;
    },
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  Object.setPrototypeOf(obj, proto);
  return obj;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class Selector {
  constructor(start, startSelector) {
    this.template = start;
    this.selectors = new Set([startSelector]);
    this.order = ['element', 'id', 'class', 'attr', 'pseudoClass', 'pseudoElement'];
  }

  orderIsCorrect(currentSelector) {
    const indexInOrder = this.order.indexOf(currentSelector);
    const nextSelectors = this.order.slice(indexInOrder + 1, this.order.length);
    return !nextSelectors.some((selector) => this.selectors.has(selector));
  }

  element(value) {
    if (this.selectors.has('element')) {
      throw Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    if (!this.orderIsCorrect('element')) {
      throw Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.template += value;
    return this;
  }

  id(value) {
    if (this.selectors.has('id')) {
      throw Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    } else {
      this.selectors.add('id');
    }
    if (!this.orderIsCorrect('id')) {
      throw Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.template += `#${value}`;
    return this;
  }

  class(value) {
    if (!this.orderIsCorrect('class')) {
      throw Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.template += `.${value}`;
    return this;
  }

  attr(value) {
    if (!this.orderIsCorrect('attr')) {
      throw Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.template += `[${value}]`;
    return this;
  }

  pseudoClass(value) {
    if (!this.orderIsCorrect('pseudoClass')) {
      throw Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.template += `:${value}`;
    return this;
  }

  pseudoElement(value) {
    if (this.selectors.has('pseudoElement')) {
      throw Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    } else {
      this.selectors.add('pseudoElement');
    }
    this.template += `::${value}`;
    return this;
  }

  combine(...args) {
    this.template = args.join(' ');
    return this;
  }

  stringify() {
    return this.template;
  }
}

const cssSelectorBuilder = {
  element(value) {
    return new Selector(value, 'element');
  },

  id(value) {
    return new Selector(`#${value}`, 'id');
  },

  class(value) {
    return new Selector(`.${value}`, 'class');
  },

  attr(value) {
    return new Selector(`[${value}]`, 'attr');
  },

  pseudoClass(value) {
    return new Selector(`:${value}`, 'pseudoClass');
  },

  pseudoElement(value) {
    return new Selector(`::${value}`, 'pseudoElement');
  },

  combine(selector1, combinator, selector2) {
    return new Selector(`${selector1.template} ${combinator} ${selector2.template}`);
  },

  stringify() {
    return new Selector().template;
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
