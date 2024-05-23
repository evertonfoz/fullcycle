import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import AddressChangedEvent from "../address-changed.event";
import CustomerCreatedEvent from "../customer-created.event";

export default class ShowMessageWhenAddressChangedHandler
  implements EventHandlerInterface<AddressChangedEvent>
{
  handle(event: CustomerCreatedEvent): void {
    console.log(`Endereço do cliente: {event.id}, {event.nome} alterado para: {event.endereco}`); 
  }
}
