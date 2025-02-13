<?php

namespace Neos\Neos\Ui\Domain\Model;

/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

use Neos\Flow\Mvc\Controller\ControllerContext;

/**
 * @internal
 */
abstract class AbstractFeedback implements FeedbackInterface
{
    /** @return array<string, mixed> */
    public function serialize(ControllerContext $controllerContext): array
    {
        return [
            'type' => $this->getType(),
            'description' => $this->getDescription(),
            'payload' => $this->serializePayload($controllerContext)
        ];
    }
}
