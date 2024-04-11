import { Sequelize } from "sequelize-typescript";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import Product from "../../../../domain/product/entity/product";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import ProductModel from "../../../product/repository/sequelize/product.model";
import OrderItemModel from "./order-item.model";


describe("OrderRepository CRUD Tests", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([CustomerModel, OrderModel, OrderItemModel, ProductModel]);
    await sequelize.sync();
  } 
);

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("1","Joao");
    const address = new Address("Rua 1",1,"8900000","Sao Paulo")

    customer.Address = address

    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("product-id-1","Product 1", 100)

    await productRepository.create(product)

    const orderRepository = new OrderRepository();
    const orderItem = new OrderItem("order-item-id-1",product.name, product.price, product.id, 2)
    const order = new Order("order-id-1",customer.id, [orderItem])

    await orderRepository.create(order)

    const orderModel = await OrderModel.findOne(
      { 
          where: { id: order.id },
          include: ["items"] 
      }
      );

    expect(orderModel.toJSON()).toStrictEqual({
      id: order.id,
      customer_id: order.customerId,
      total: order.total(),
      items:[
          {
              id: orderItem.id,
              name: orderItem.name,
              price: orderItem.price,
              quantity: orderItem.quantity,
              order_id: order.id,
              product_id: product.id
          }
      ]
    });
  });
});
