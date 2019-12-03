const React = require('react')
const Enzyme = require('enzyme')
const Adapter =  require('enzyme-adapter-react-16')
const sinon = require('sinon')
const { WindowResizeListener } = require('../lib/WindowResizeListener')
 
Enzyme.configure({ adapter: new Adapter() });

describe('WindowResizeListener', () => {
    const renderComponent = (onResize) => {
        return Enzyme.shallow(
            React.createElement(WindowResizeListener, { onResize })
        )
    }

    const resize = (width, height) => {
        const resizeEvent = document.createEvent('Event');
        resizeEvent.initEvent('resize', true, true);
        
        global.window.innerWidth = width || global.window.innerWidth;
        global.window.innerHeight = height || global.window.innerHeight;
        global.window.dispatchEvent(resizeEvent);
    }

    it('should pass new window height and width to resize callback', (callback) => {
        const onResize = ({windowWidth, windowHeight}) => {
            expect(windowWidth).toBe(300)
            expect(windowHeight).toBe(200)

            callback()
        }
        const wrapper = renderComponent(onResize)

        resize(300, 200)
    })


    it('should not call resize callback immediately after window resize event', (callback) => {
        const onResize = sinon.spy()
        const wrapper = renderComponent(onResize)

        resize(300, 200)

        expect(onResize.callCount).toBe(0)

        setTimeout(() => {
            expect(onResize.callCount).toBe(1)

            callback()
        }, 200)
    })


    it('should not call resize callback on component mount', (callback) => {
        const onResize = sinon.spy()
        const wrapper = renderComponent(onResize)

        setTimeout(() => {
            expect(onResize.callCount).toBe(0)

            callback()
        }, 200)
    })


    it('should remove listener on window size after component is unmounted', (callback) => {
        const onResize = sinon.spy()
        const wrapper = renderComponent(onResize)

        wrapper.unmount()
        resize(300, 200)

        setTimeout(() => {
            expect(onResize.callCount).toBe(0)

            callback()
        }, 200)
    })


    it('should replace resize callback when new one is provided through the props', (callback) => {
        const onResize = sinon.spy()
        const onResizeNew = sinon.spy()
        const wrapper = renderComponent(onResize)

        wrapper.setProps({ onResize: onResizeNew })
        resize(300, 200)

        setTimeout(() => {
            expect(onResize.callCount).toBe(0)
            expect(onResizeNew.callCount).toBe(1)

            callback()
        }, 200)
    })
})
