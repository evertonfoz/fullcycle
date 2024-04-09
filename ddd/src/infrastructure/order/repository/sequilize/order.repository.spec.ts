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

    sequelize.addModels([CustomerModel]);
    sequelize.addModels([ProductModel]);
    sequelize.addModels([OrderModel]);
    sequelize.addModels([OrderItemModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });


  
  let customerRepository: CustomerRepository;
  let productRepository: ProductRepository;
  let orderRepository: OrderRepository;
  let createdOrder: Order;

  beforeEach(async () => {
    customerRepository = new CustomerRepository();
    productRepository = new ProductRepository();
    orderRepository = new OrderRepository();

    // Criando um cliente e um produto para serem usados nos testes
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    // Criando uma ordem para ser usada nos testes
    const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);
    createdOrder = new Order("123", customer.id, [orderItem]);
  });

  afterEach(async () => {
    // Limpar os dados do teste (excluir o pedido criado, por exemplo)
    if (createdOrder) {
      await OrderModel.destroy({ where: { id: createdOrder.id } });
    }
  });

  it("should create a new order", async () => {
    await orderRepository.create(createdOrder);

    const orderModel = await OrderModel.findOne({
      where: { id: createdOrder.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: createdOrder.id,
      customer_id: createdOrder.customerId,
      total: createdOrder.total(),
      items: [
        {
          id: createdOrder.items[0].id,
          name: createdOrder.items[0].name,
          price: createdOrder.items[0].price,
          quantity: createdOrder.items[0].quantity,
          order_id: createdOrder.id,
          product_id: createdOrder.items[0].productId,
        },
      ],
    });
  });

  it("should find an order by ID", async () => {
    // Crie um pedido no banco de dados para ser encontrado
    await orderRepository.create(createdOrder);

    const foundOrder = await orderRepository.find(createdOrder.id);

    expect(foundOrder).toEqual(createdOrder);
  });

  it("should find all orders", async () => {
    // Crie alguns pedidos no banco de dados para serem encontrados
    await orderRepository.create(createdOrder);

    const foundOrders = await orderRepository.findAll();

    expect(foundOrders).toHaveLength(1);
    expect(foundOrders[0]).toEqual(createdOrder);
  });

  it("should update an order", async () => {
    sequelize.addModels([CustomerModel]);

    // Crie um pedido no banco de dados para ser atualizado
    await orderRepository.create(createdOrder);


    await orderRepository.update(createdOrder);

    const updatedOrder = await orderRepository.find(createdOrder.id);

    expect(updatedOrder).toEqual(createdOrder);
  });

  it("should delete an order", async () => {
    // Crie um pedido no banco de dados para ser excluído
    await orderRepository.create(createdOrder);

    await orderRepository.delete(createdOrder.id);

    const deletedOrder = await orderRepository.find(createdOrder.id);

    expect(deletedOrder).toBeNull();
  });
});
