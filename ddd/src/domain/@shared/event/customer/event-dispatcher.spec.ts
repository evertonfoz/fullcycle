import CustomerCreatedEvent from "../../../customer/event/customer-created.event";
import ShowMessageWhenAddressChangedHandler from "../../../customer/event/handler/show-message-when-address-changed.handler";
import ShowMessageWhenCustomerIsCreatedHandler01 from "../../../customer/event/handler/show-message-when-customer-is-created.handler_one";
import ShowMessageWhenCustomerIsCreatedHandler02 from "../../../customer/event/handler/show-message-when-customer-is-created.handler_two";
import EventDispatcher from "../event-dispatcher";

describe("Domain events tests", () => {
  it("should register an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler01 = new ShowMessageWhenCustomerIsCreatedHandler01();
    const eventHandler02 = new ShowMessageWhenCustomerIsCreatedHandler02();
    const eventHandler03 = new ShowMessageWhenAddressChangedHandler();

    eventDispatcher.register("CustomerCreatedEvent01", eventHandler01);
    eventDispatcher.register("CustomerCreatedEvent02", eventHandler02);
    eventDispatcher.register("AddressChangedEvent", eventHandler03);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent01"]
    ).toBeDefined();
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent02"]
    ).toBeDefined();
    expect(
      eventDispatcher.getEventHandlers["AddressChangedEvent"]
    ).toBeDefined();

    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent01"].length).toBe(
      1
    );
    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent02"].length).toBe(
      1
    );
    expect(eventDispatcher.getEventHandlers["AddressChangedEvent"].length).toBe(
      1
    );

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent01"][0]
    ).toMatchObject(eventHandler01);
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent02"][0]
    ).toMatchObject(eventHandler02);
    expect(
      eventDispatcher.getEventHandlers["AddressChangedEvent"][0]
    ).toMatchObject(eventHandler03);
  });

  it("should unregister an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler01 = new ShowMessageWhenCustomerIsCreatedHandler01();
    const eventHandler02 = new ShowMessageWhenCustomerIsCreatedHandler02();
    const eventHandler03 = new ShowMessageWhenAddressChangedHandler();

    eventDispatcher.register("CustomerCreatedEvent01", eventHandler01);
    eventDispatcher.register("CustomerCreatedEvent02", eventHandler02);
    eventDispatcher.register("AddressChangedEvent", eventHandler03);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent01"]
    ).toBeDefined();
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent02"]
    ).toBeDefined();
    expect(
      eventDispatcher.getEventHandlers["AddressChangedEvent"]
    ).toBeDefined();

    eventDispatcher.unregister("CustomerCreatedEvent01", eventHandler01);
    eventDispatcher.unregister("CustomerCreatedEvent02", eventHandler02);
    eventDispatcher.unregister("AddressChangedEvent", eventHandler03);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent01"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent01"].length).toBe(
      0
    );
    expect(eventDispatcher.getEventHandlers["AddressChangedEvent"].length).toBe(
      0
    );
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent02"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent02"].length).toBe(
      0
    );
    expect(eventDispatcher.getEventHandlers["AddressChangedEvent"].length).toBe(
      0
    );
  });

  it("should unregister all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler01 = new ShowMessageWhenCustomerIsCreatedHandler01();
    const eventHandler02 = new ShowMessageWhenCustomerIsCreatedHandler02();
    const eventHandler03 = new ShowMessageWhenAddressChangedHandler();

    eventDispatcher.register("CustomerCreatedEvent01", eventHandler01);
    eventDispatcher.register("CustomerCreatedEvent02", eventHandler02);
    eventDispatcher.register("AddressChangedEvent", eventHandler03);


    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent01"][0]
    ).toMatchObject(eventHandler01);
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent02"][0]
    ).toMatchObject(eventHandler02);
    expect(
      eventDispatcher.getEventHandlers["AddressChangedEvent"][0]
    ).toMatchObject(eventHandler03);

    eventDispatcher.unregisterAll();

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent01"]
    ).toBeUndefined();
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent02"]
    ).toBeUndefined();
    expect(
      eventDispatcher.getEventHandlers["AddressChangedEvent"]
    ).toBeUndefined();
  });

  it("should notify all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler01 = new ShowMessageWhenCustomerIsCreatedHandler01();
    const eventHandler02 = new ShowMessageWhenCustomerIsCreatedHandler02();
    const eventHandler03 = new ShowMessageWhenAddressChangedHandler();
    // const spyEventHandler01 = jest.spyOn(eventHandler01, "handle");
    // const spyEventHandler02 = jest.spyOn(eventHandler02, "handle");

    eventDispatcher.register("CustomerCreatedEvent01", eventHandler01);
    eventDispatcher.register("CustomerCreatedEvent02", eventHandler02);
    eventDispatcher.register("AddressChangedEvent", eventHandler03);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent01"][0]
    ).toMatchObject(eventHandler01);
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent02"][0]
    ).toMatchObject(eventHandler02);
    expect(
      eventDispatcher.getEventHandlers["AddressChangedEvent"][0]
    ).toMatchObject(eventHandler03);

    const customerCreatedEvent = new CustomerCreatedEvent({
      name: "Product 1",
      description: "Product 1 description",
      price: 10.0,
    });

    // Quando o notify for executado o SendEmailWhenProductIsCreatedHandler.handle() deve ser chamado
    eventDispatcher.notify(customerCreatedEvent);

    // expect(spyEventHandler01).toHaveBeenCalled();
    // expect(spyEventHandler02).toHaveBeenCalled();
  });
});
