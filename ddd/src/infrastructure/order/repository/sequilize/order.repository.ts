import Order from "../../../../domain/checkout/entity/order";
import OrderModel from "./order.model";
import OrderItemModel from "./order-item.model";

export default class OrderRepository {
  async create(entity: Order): Promise<void> {
    await OrderModel.create({
      id: entity.id,
      customer_id: entity.customerId,
      total: entity.total,
      items: entity.items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        product_id: item.productId,
        quantity: item.quantity,
      })),
    }, {
      include: [{ model: OrderItemModel }],
    });
  }

  async update(entity: Order): Promise<void> {
    try {
      const existingOrder = await OrderModel.findByPk(entity.id);

      if (!existingOrder) {
        throw new Error(`Order with ID ${entity.id} not found.`);
      }

      await OrderModel.update(
        {
          customer_id: entity.customerId,
          total: entity.total,
          items: entity.items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            product_id: item.productId,
            quantity: item.quantity,
          })),
        },
        {
          where: { id: entity.id },
          returning: true,
        }
      );
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  }

  async find(id: string): Promise<Order | null> {
    try {
      const result = await OrderModel.findByPk(id, {
        include: [{ model: OrderItemModel }],
      });

      return result ? this.convertModelToEntity(result) : null;
    } catch (error) {
      console.error("Error finding order by ID:", error);
      throw error;
    }
  }

  async findAll(): Promise<Order[]> {
    try {
      const results = await OrderModel.findAll({
        include: [{ model: OrderItemModel }],
      });

      return results.map((result) => this.convertModelToEntity(result));
    } catch (error) {
      console.error("Error finding all orders:", error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await OrderModel.destroy({
        where: { id },
      });
    } catch (error) {
      console.error("Error deleting order:", error);
      throw error;
    }
  }

  private convertModelToEntity(model: any): Order {
    const order = new Order(
      model.id,
      model.customer_id,
      model.items.map((item: any) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        productId: item.product_id,
        quantity: item.quantity,
      }))
    );

    return order;
  }
}
