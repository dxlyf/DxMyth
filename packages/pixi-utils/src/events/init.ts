import { extensions } from '../extensions/Extensions';
import { EventSystem } from './EventSystem';
import { FederatedContainer } from './FederatedEventTarget';

extensions.add(EventSystem);
extensions.mixin(FederatedContainer);
