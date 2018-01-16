# BEM (basics)

## (B) Block

A functionally __independent__ page component that __can be reused__. In HTML, blocks are represented by the `class` attribute.
It's important to emphasize that a `block name` describes its `purpose` (what is it? e.g: menu or button), not its state (what does it look like? e.g: red or big)

```html
<!-- Correct. The `error` block is semantically meaningful -->
<div class="error"></div>

<!-- Incorrect. It describes the appearance -->
<div class="red-text"></div>
```

- The block shouldn't influence its environment, meaning you shouldn't set the external geometry (`margin`) or `positioning` for the block.

- You also **shouldn't** use CSS `tag` or `ID` selectors when using BEM (to ensure independence for reusing blocks).



## (E) Element

Part inside the block that can't be used separately from it.  
The `element name` describes its purpose, not its state (like the block).

The structure of an element's full name is `block-name__element-name`. The `element name` is separated from the `block name` with double underscore (__).

```html
<!-- `search-form` block -->
<form class="search-form">
    <!-- `input` element in the `search-form` block -->
    <input class="search-form__input">

    <!-- `button` element in the `search-form` block -->
    <button class="search-form__button">Search</button>
</form>
```


An element is always part of a block, not another element. This means that element names can't define a hierarchy such as `block__elem1__elem2`.

```html
<!--
    Correct. The structure of the full element name follows the pattern:
    `block-name__element-name`
-->
<form class="search-form">
    <div class="search-form__content">
        <input class="search-form__input">

        <button class="search-form__button">Search</button>
    </div>
</form>

<!--
    Incorrect. The structure of the full element name doesn't follow the pattern:
    `block-name__element-name`
-->
<form class="search-form">
    <div class="search-form__content">
        <!-- Recommended: `search-form__input` or `search-form__content-input` -->
        <input class="search-form__content__input">

        <!-- Recommended: `search-form__button` or `search-form__content-button` -->
        <button class="search-form__content__button">Search</button>
    </div>
</form>
```

An element is always part of a block, and you shouldn't use it separately from the block:

```html
<!-- Correct. Elements are located inside the `search-form` block -->
<!-- `search-form` block -->
<form class="search-form">
    <!-- `input` element in the `search-form` block -->
    <input class="search-form__input">

    <!-- `button` element in the `search-form` block -->
    <button class="search-form__button">Search</button>
</form>

<!--
    Incorrect. Elements are located outside of the context of
    the `search-form` block
-->
<!-- `search-form` block -->
<form class="search-form">
</form>

<!-- `input` element in the `search-form` block -->
<input class="search-form__input">

<!-- `button` element in the `search-form` block-->
<button class="search-form__button">Search</button>
```

An element is an optional block component. Not all blocks have elements!

## Should I create a block or an element?

### Create a block
If a section of code might be reused and it doesn't depend on other page components being implemented.

### Create an element
If a section of code can't be used separately without the parent entity (the block).

The exception is elements that must be divided into smaller parts – subelements – in order to simplify development. In the BEM methodology, **you can't create elements of elements**. In a case like this, instead of creating an element, you need to create a service block.


## (M) Modifier

An entity that defines the `appearance`, `state`, or `behavior` of a block or element.

The modifier name describes its `appearance` ("What size?" or "Which theme?" and so on — `size_s` or `theme_islands`), its `state` ("How is it different from the others?" — `disabled`, `focused`, etc.) and its `behavior` ("How does it behave?" or "How does it respond to the user?" — such as `directions_left-top`).

The modifier name is separated from the `block` or `element` name by a `single underscore` (_).

The structure of the modifier's full name follows the pattern:

- `block-name_modifier-name`
- `block-name__element-name_modifier-name`


**`IMPORTANT:`** From the BEM perspective, a modifier **can't be used in isolation from the modified block or element**. A modifier should change the appearance, behavior, or state of the entity, **not** replace it.


### Types of modifiers: 

#### Boolean: 
Used when only the presence or absence of the modifier is important, and its value is irrelevant. For example, `disabled`. If a Boolean modifier is present, its **value is assumed** to be `true`.

```html
<!-- The `search-form` block has the `focused` Boolean modifier -->
<form class="search-form search-form_focused">
    <input class="search-form__input">

    <!-- The `button` element has the `disabled` Boolean modifier -->
    <button class="search-form__button search-form__button_disabled">Search</button>
</form>
```

#### Key-value
- Used when the modifier value is important. For example, "a menu with the islands design theme": 
- The name pattern is `block-name_modifier-name_modifier-value` or `block-name__element-name_modifier-name_modifier-value`.


```html
    <!-- The `button` element has the `size` modifier with the value `m` -->
    <button class="search-form__button search-form__button_size_m">Search</button>
```



## File Structure
READ MORE HERE: https://en.bem.info/methodology/filestructure/#file-structure-organization


## Related info:
- https://en.bem.info
- https://en.bem.info/methodology/quick-start/
- https://en.bem.info/toolbox/bem-tools/
- https://en.bem.info/methodology/filestructure/#file-structure-organization
- https://www.youtube.com/watch?v=Ysf0LhP8jus