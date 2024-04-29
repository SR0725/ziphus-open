import fastifyFactory from "@/adapter/in/fastify/fastify-factory";
import SocketIoFactory from "@/adapter/in/socket/socket-io-factory";
import YSocketIOFactory from "@/adapter/in/yjs/y-socket-io-factory";

// 持久層 介面
import { type LoadAccountPort } from "@/application/port/out/load-account-port";
import { type SaveAccountPort } from "@/application/port/out/save-account-port";
import { type LoadCardListPort } from "@/application/port/out/load-card-list-port";
import { type LoadCardPort } from "@/application/port/out/load-card-port";
import { type PushCardImagePort } from "@/application/port/out/push-card-image-port";
import { type SaveCardPort } from "@/application/port/out/save-card-port";
import { type DeleteCardPort } from "@/application/port/out/delete-card-port";
import { type LoadSpaceListPort } from "@/application/port/out/load-space-list-port";
import { type LoadSpacePort } from "@/application/port/out/load-space-port";
import { type SaveSpacePort } from "@/application/port/out/save-space-port";
import { type DeleteSpacePort } from "@/application/port/out/delete-space-port";
import { type LoadSpaceCardListPort } from "@/application/port/out/load-space-card-list-port";
import { type SaveSpaceCardPort } from "@/application/port/out/save-space-card-port";
import { type DeleteSpaceCardPort } from "@/application/port/out/delete-space-card-port";
import { type DeleteManySpaceCardPort } from "@/application/port/out/delete-many-space-card-port";
import { type LoadSpaceCardPort } from "@/application/port/out/load-space-card-port";

// 持久層 實作
import createMongoClientCollection from "@/adapter/out/persistence/mongo-db";
import AccountPersistenceSaveAdapter from "@/adapter/out/persistence/account-persistence-save-adapter";
import AccountPersistenceLoadAdapter from "@/adapter/out/persistence/account-persistence-load-adapter";
import CardListPersistenceLoadAdapter from "@/adapter/out/persistence/card-list-persistence-load-adapter";
import CardPersistenceLoadAdapter from "@/adapter/out/persistence/card-persistence-load-adapter";
import CardPersistencePushImageAdapter from "@/adapter/out/persistence/card-persistence-push-image-adapter";
import CardPersistenceSaveAdapter from "@/adapter/out/persistence/card-persistence-save-adapter";
import CardPersistenceDeleteAdapter from "@/adapter/out/persistence/card-persistence-delete-adapter";
import SpaceCardListPersistenceLoadAdapter from "@/adapter/out/persistence/space-card-list-persistence-load-adapter";
import SpaceCardPersistenceDeleteAdapter from "@/adapter/out/persistence/space-card-persistence-delete-adapter";
import SpaceCardPersistenceDeleteManyAdapter from "@/adapter/out/persistence/space-card-persistence-delete-many-adapter";
import SpaceCardPersistenceLoadAdapter from "@/adapter/out/persistence/space-card-persistence-load-adapter";
import SpaceCardPersistenceSaveAdapter from "@/adapter/out/persistence/space-card-persistence-save-adapter";
import SpaceListPersistenceLoadAdapter from "@/adapter/out/persistence/space-list-persistence-load-port";
import SpacePersistenceDeleteAdapter from "@/adapter/out/persistence/space-persistence-delete-adapter";
import SpacePersistenceLoadAdapter from "@/adapter/out/persistence/space-persistence-load-port";
import SpacePersistenceSaveAdapter from "@/adapter/out/persistence/space-persistence-save-adapter";

// 使用案例
import accountLoginWithEmailUseCaseConstructor from "@/application/domain/service/account-login-with-email-service";
import accountGetInfoUseCaseConstructor from "@/application/domain/service/account-get-info-service";
import accountRegisterUseCaseConstructor from "@/application/domain/service/account-register-service";
import cardCreateUseCaseConstructor from "@/application/domain/service/card-create-service";
import cardGetWithAllUseCaseConstructor from "@/application/domain/service/card-get-with-all-service";
import cardModifyContentUseCaseConstructor from "@/application/domain/service/card-modify-content-service";
import cardModifyTitleUseCaseConstructor from "@/application/domain/service/card-modify-title-service";
import cardGetByIdUseCaseConstructor from "@/application/domain/service/card-get-by-id-service";
import cardModifySizeUseCaseConstructor from "@/application/domain/service/card-modify-size-service";
import cardModifyIsSizeFitContentUseCaseConstructor from "@/application/domain/service/card-modify-is-size-fit-content-service";
import cardAccessEditValidatorUseCaseConstructor from "@/application/domain/service/card-access-edit-validator-service";
import cardModifyPermissionUseCaseConstructor from "@/application/domain/service/card-modify-permission-service";
import cardDeleteUseCaseConstructor from "@/application/domain/service/card-delete-service";
import spaceCardCreateUseCaseConstructor from "@/application/domain/service/space-card-create-service";
import spaceCardDeleteUseCaseConstructor from "@/application/domain/service/space-card-delete-service";
import spaceCreateUseCaseConstructor from "@/application/domain/service/space-create-service";
import spaceDeleteUseCaseConstructor from "@/application/domain/service/space-delete-service";
import spaceGetByIdUseCaseConstructor from "@/application/domain/service/space-get-by-id-service";
import spaceGetWithAllUseCaseConstructor from "@/application/domain/service/space-get-with-all-use-case";
import spaceModifyTitleUseCaseConstructor from "@/application/domain/service/space-modify-title-service";
import spaceCardUpdatePositionUseCaseConstructor from "@/application/domain/service/space-card-update-position-service";
import spaceCardUpdateLayerUseCaseConstructor from "@/application/domain/service/space-card-update-layer-service";
import cardAddImageCaseConstructor from "@/application/domain/service/card-add-image-service";

// 路由
import accountRegisterController from "@/adapter/in/fastify/account-register-controller";
import accountLoginWithEmailController from "@/adapter/in/fastify/account-login-with-email-controller";
import accountMeController from "@/adapter/in/fastify/account-me-controller";
import cardCreateController from "@/adapter/in/fastify/card-create-controller";
import cardGetWithAllController from "@/adapter/in/fastify/card-get-with-all-controller";
import cardGetByIdController from "@/adapter/in/fastify/card-get-by-id-controller";
import cardAddImageController from "@/adapter/in/fastify/card-add-image-controller";
import cardModifyContentController from "@/adapter/in/fastify/card-modify-content-controller";
import cardModifyTitleController from "@/adapter/in/fastify/card-modify-title-controller";
import cardModifyPermissionController from "@/adapter/in/fastify/card-modify-permission-controller";
import cardDeleteController from "@/adapter/in/fastify/card-delete-controller";
import cardImmediateModifyContentController from "@/adapter/in/socket/card-immediate-modify-content-controller";
import spaceCreateController from "@/adapter/in/fastify/space-create-controller";
import spaceGetWithAllController from "@/adapter/in/fastify/space-get-with-all-controller";
import spaceCardCreateController from "@/adapter/in/fastify/space-card-create-controller";
import spaceCardDeleteController from "@/adapter/in/fastify/space-card-delete-controller";
import spaceDeleteController from "@/adapter/in/fastify/space-delete-controller";
import spaceGetByIdController from "@/adapter/in/fastify/space-get-by-id-controller";
import spaceModifyTitleController from "@/adapter/in/fastify/space-modify-title-controller";
import spaceCardImmediateUpdatePositionUseCaseController from "@/adapter/in/socket/space-card-immediate-update-position-controller";
import CreateSocketEmitAdapter from "@/adapter/out/io/emit-socket-adapter";
import cardModifyIsSizeFitContentController from "@/adapter/in/fastify/card-modify-is-size-fit-content-controller copy";
import cardModifySizeController from "@/adapter/in/fastify/card-modify-size-controller";
import spaceCardUpdateLayerController from "@/adapter/in/fastify/space-card-update-layer-controller";
import spaceCardListGetBySpaceIdUseCaseConstructor from "@/application/domain/service/space-card-list-get-by-id-service";
import spaceCardListGetBySpaceIdController from "@/adapter/in/fastify/space-card-list-get-by-space-id-controller";

async function init() {
  // 初始化持久層
  const mongoCollections = await createMongoClientCollection();
  const loadAccount: LoadAccountPort =
    AccountPersistenceLoadAdapter(mongoCollections);
  const saveAccount: SaveAccountPort =
    AccountPersistenceSaveAdapter(mongoCollections);
  const loadCardList: LoadCardListPort =
    CardListPersistenceLoadAdapter(mongoCollections);
  const loadCard: LoadCardPort = CardPersistenceLoadAdapter(mongoCollections);
  const saveCard: SaveCardPort = CardPersistenceSaveAdapter(mongoCollections);
  const pushCardImage: PushCardImagePort =
    CardPersistencePushImageAdapter(mongoCollections);
  const deleteCard: DeleteCardPort =
    CardPersistenceDeleteAdapter(mongoCollections);
  const loadSpaceList: LoadSpaceListPort =
    SpaceListPersistenceLoadAdapter(mongoCollections);
  const loadSpace: LoadSpacePort =
    SpacePersistenceLoadAdapter(mongoCollections);
  const saveSpace: SaveSpacePort =
    SpacePersistenceSaveAdapter(mongoCollections);
  const deleteSpace: DeleteSpacePort =
    SpacePersistenceDeleteAdapter(mongoCollections);
  const loadSpaceCardList: LoadSpaceCardListPort =
    SpaceCardListPersistenceLoadAdapter(mongoCollections);
  const loadSpaceCard: LoadSpaceCardPort =
    SpaceCardPersistenceLoadAdapter(mongoCollections);
  const saveSpaceCard: SaveSpaceCardPort =
    SpaceCardPersistenceSaveAdapter(mongoCollections);
  const deleteSpaceCard: DeleteSpaceCardPort =
    SpaceCardPersistenceDeleteAdapter(mongoCollections);
  const deleteManySpaceCard: DeleteManySpaceCardPort =
    SpaceCardPersistenceDeleteManyAdapter(mongoCollections);

  // 初始化 use case
  const accountRegisterUseCase = accountRegisterUseCaseConstructor(
    loadAccount,
    saveAccount
  );
  const accountLoginWithEmailUseCase =
    accountLoginWithEmailUseCaseConstructor(loadAccount);
  const accountGetInfoUseCase = accountGetInfoUseCaseConstructor(loadAccount);
  const cardCreateUseCase = cardCreateUseCaseConstructor(loadAccount, saveCard);
  const cardGetWithAllUseCase = cardGetWithAllUseCaseConstructor(loadCardList);
  const cardGetByIdUseCase = cardGetByIdUseCaseConstructor(loadCard);
  const cardAddImageUseCase = cardAddImageCaseConstructor(
    loadCard,
    pushCardImage
  );
  const cardModifyContentUseCase = cardModifyContentUseCaseConstructor(
    loadCard,
    saveCard
  );
  const cardModifyTitleUseCase = cardModifyTitleUseCaseConstructor(
    loadCard,
    saveCard
  );
  const cardModifyPermissionUseCase = cardModifyPermissionUseCaseConstructor(
    loadCard,
    saveCard
  );
  const cardModifySizeUseCase = cardModifySizeUseCaseConstructor(
    loadCard,
    saveCard
  );
  const cardModifyIsSizeFitContentUseCase =
    cardModifyIsSizeFitContentUseCaseConstructor(loadCard, saveCard);
  const cardAccessEditValidatorCase =
    cardAccessEditValidatorUseCaseConstructor(loadCard);
  const cardDeleteUseCase = cardDeleteUseCaseConstructor(
    loadCard,
    deleteCard,
    deleteManySpaceCard
  );
  const spaceCardCreateUseCase = spaceCardCreateUseCaseConstructor(
    loadSpace,
    saveSpaceCard
  );
  const spaceCardDeleteUseCase = spaceCardDeleteUseCaseConstructor(
    loadSpace,
    loadSpaceCard,
    deleteSpaceCard
  );
  const spaceCreateUseCase = spaceCreateUseCaseConstructor(
    loadAccount,
    saveSpace
  );
  const spaceDeleteUseCase = spaceDeleteUseCaseConstructor(
    loadSpace,
    deleteSpace
  );
  const spaceGetByIdUseCase = spaceGetByIdUseCaseConstructor(loadSpace);
  const spaceGetWithAllUseCase =
    spaceGetWithAllUseCaseConstructor(loadSpaceList);
  const spaceModifyTitleUseCase = spaceModifyTitleUseCaseConstructor(
    loadSpace,
    saveSpace
  );
  const spaceCardUpdatePositionUseCase =
    spaceCardUpdatePositionUseCaseConstructor(
      loadSpace,
      loadSpaceCard,
      saveSpaceCard
    );
  const spaceCardUpdateLayerUseCase = spaceCardUpdateLayerUseCaseConstructor(
    loadSpaceCard,
    loadSpace,
    saveSpace
  );
  const spaceCardListGetBySpaceIdUseCase =
    spaceCardListGetBySpaceIdUseCaseConstructor(loadSpace, loadSpaceCardList);
  // 初始化基礎設施
  console.log("PORT", process.env.PORT);
  const port = Number(process.env.PORT) || 8080;

  const fastify = fastifyFactory(port);
  const io = SocketIoFactory(fastify);
  YSocketIOFactory(io);
  const emitSocket = CreateSocketEmitAdapter(io);

  // 註冊 controller
  fastify.after(() => {
    accountRegisterController(fastify, accountRegisterUseCase);
    accountLoginWithEmailController(fastify, accountLoginWithEmailUseCase);
    accountMeController(fastify, accountGetInfoUseCase);
    cardCreateController(fastify, cardCreateUseCase);
    cardGetWithAllController(fastify, cardGetWithAllUseCase);
    cardGetByIdController(fastify, cardGetByIdUseCase);
    cardAddImageController(fastify, cardAddImageUseCase);
    cardModifyContentController(fastify, cardModifyContentUseCase);
    cardModifyTitleController(fastify, cardModifyTitleUseCase);
    cardModifyPermissionController(fastify, cardModifyPermissionUseCase);
    cardModifySizeController(fastify, [cardModifySizeUseCase, emitSocket]);
    cardModifyIsSizeFitContentController(fastify, [
      cardModifyIsSizeFitContentUseCase,
      emitSocket,
    ]);
    cardDeleteController(fastify, [cardDeleteUseCase, emitSocket]);
    spaceCreateController(fastify, spaceCreateUseCase);
    spaceDeleteController(fastify, spaceDeleteUseCase);
    spaceGetWithAllController(fastify, spaceGetWithAllUseCase);
    spaceGetByIdController(fastify, spaceGetByIdUseCase);
    spaceCardCreateController(fastify, [spaceCardCreateUseCase, emitSocket]);
    spaceCardDeleteController(fastify, [spaceCardDeleteUseCase, emitSocket]);
    spaceModifyTitleController(fastify, spaceModifyTitleUseCase);
    spaceCardUpdateLayerController(fastify, [
      spaceCardUpdateLayerUseCase,
      emitSocket,
    ]);
    spaceCardListGetBySpaceIdController(
      fastify,
      spaceCardListGetBySpaceIdUseCase
    );
  });

  fastify.ready((err) => {
    if (err) throw err;

    io.on("connection", (socket) => {
      cardImmediateModifyContentController(socket, [
        cardGetByIdUseCase,
        cardModifyContentUseCase,
      ]);
      spaceCardImmediateUpdatePositionUseCaseController(socket, [
        spaceCardUpdatePositionUseCase,
        emitSocket,
      ]);
      socket.on("join-space", (room) => {
        socket.join(room);
      });
      socket.on("disconnect", () => {
        console.log("user disconnected");
      });
    });
    fastify.swagger();
  });
}

init();
